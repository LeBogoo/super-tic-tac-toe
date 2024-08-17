import { BasePacket } from "../base-packet";

export class CreateGamePacket extends BasePacket {
  constructor(public emoji: string) {
    super("create_game");
  }
}
