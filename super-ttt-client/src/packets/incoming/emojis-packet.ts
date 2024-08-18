import { BasePacket } from "../base-packet";

export class EmojisPacket extends BasePacket {
  constructor(public emojis: string[]) {
    super("emojis");
  }
}
