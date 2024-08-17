import { BasePacket } from "./packets/base-packet";

/**
 * A basic packet system that supports type safe serialisation and deserialisation.
 */
export class PacketSystem {
  static debug = false;

  packets: Map<string, Function[]> = new Map();
  constructor() {}

  /**
   * Registers an packet listener for a specific packet
   * @param packetName The name of the packet to register
   * @param listener The listener to register
   */
  on<T extends BasePacket>(
    packetName: string,
    listener: (packet: T) => void
  ): void {
    let registered = this.packets.get(packetName) || [];
    registered.push(listener);
    this.packets.set(packetName, registered);
  }

  /**
   * Unregisters one or all listeners for a specific packet
   * @param packetName The name of the packet to unregister
   * @param listener The listener to unregister. If not provided, all listeners for the packet will be unregistered
   */
  off(packetName: string, listener?: (packet: BasePacket) => void): void {
    let registered = this.packets.get(packetName) || [];
    if (listener) {
      registered = registered.filter((l) => l !== listener);
      this.packets.set(packetName, registered);
    } else {
      this.packets.delete(packetName);
    }
  }

  /**
   * Emits an packet to all listeners
   * @param packet The packet to emit
   */
  emit(packet: BasePacket): void {
    let packetListeners = this.packets.get(packet.type) || [];
    let broadcastListeners = this.packets.get("*") || [];
    // check if packet is a child of BasePacket. if not create a new instance of BasePacket and assign the properties
    if (!(packet instanceof BasePacket)) {
      const basePacket = new BasePacket("BasePacket");
      Object.assign(basePacket, packet);
      packet = basePacket;
    }

    [...packetListeners, ...broadcastListeners].forEach((listener) =>
      listener(packet)
    );
  }

  /**
   * Parses a stringified packet and emits it to all listeners
   * @param packetString The stringified packet
   */
  parse(packetString: string): void {
    const parsed = BasePacket.parse(packetString);
    this.emit(parsed);
  }
}
