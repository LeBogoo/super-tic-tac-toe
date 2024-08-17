import { PacketSystem } from "./packet-system";
import { BasePacket } from "./packets/base-packet";
import { DisconnectedEvent } from "./packets/incoming/disconnected-event";

export class Connection extends PacketSystem {
  ws!: WebSocket;
  id: string | undefined;

  constructor(private address: string, public autoreconnect: boolean = true) {
    super();
  }

  public async test(url: string) {
    url = url.split("//")[1];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 200);

    try {
      const request = await fetch("http://" + url + "/ping", {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return request.status == 200;
    } catch (e) {
      return false;
    }
  }

  public connect() {
    if (this.ws) {
      console.log("⌛", `Found existing connection. Closing old connection...`);
      this.ws.close();
    }

    console.log("⌛", `Connecting to ${this.address}...`);
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.address, ["super-ttt"]);

      this.ws.addEventListener("close", this.connectionClosed.bind(this));
      this.ws.addEventListener("open", this.connectionOpened.bind(this));
      this.ws.addEventListener("message", this.messageReceived.bind(this));

      const connectionOpened = () => {
        this.ws.removeEventListener("open", connectionOpened);
        this.ws.removeEventListener("close", connectionClosed);
        resolve();
      };

      const connectionClosed = () => {
        this.ws.removeEventListener("open", connectionOpened);
        this.ws.removeEventListener("close", connectionClosed);
        reject();
      };

      this.ws.addEventListener("open", connectionOpened);
      this.ws.addEventListener("close", connectionClosed);
    });
  }

  public setServerURL(url: string) {
    this.address = url;
  }

  public getServerURL() {
    return this.address;
  }

  public send(packet: BasePacket) {
    if (this.ws.readyState != this.ws.OPEN)
      throw new Error("Websocket is not open.");
    console.log("↗️", packet.stringify());
    this.ws.send(packet.stringify());
  }

  private messageReceived(ev: { data: string }) {
    console.log("↙️", ev.data);
    this.parse(ev.data);
  }

  private connectionOpened() {
    if (this.id) return;
    console.log("✅", "Connected to server!");
  }

  private connectionClosed() {
    this.emit(new DisconnectedEvent());
    if (this.autoreconnect) {
      setTimeout(() => {
        console.log("❌", "Connection failed. Trying to reconnect...");
        this.connect();
      }, 1000);
    }
  }
}
