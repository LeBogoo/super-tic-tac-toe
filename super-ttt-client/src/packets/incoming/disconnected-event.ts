import { BasePacket } from "../base-packet";

export class DisconnectedEvent extends BasePacket {
  constructor() {
    super("disconnected");
  }
}
