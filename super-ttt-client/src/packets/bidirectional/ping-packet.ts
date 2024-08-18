import { BasePacket } from "../base-packet";

export class PingPacket extends BasePacket {
  constructor(public timestamp: number) {
    super("ping");
  }
}
