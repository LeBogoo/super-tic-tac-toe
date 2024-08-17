import { BasePacket } from "../base-packet";

export class FindGamePacket extends BasePacket {
  constructor(public emoji: string) {
    super("find_game");
  }
}
