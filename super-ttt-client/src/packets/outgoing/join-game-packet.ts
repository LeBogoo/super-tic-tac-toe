import { BasePacket } from "../base-packet";

export class JoinGamePacket extends BasePacket {
  constructor(public gameCode: string, public emoji: string) {
    super("join_game");
  }
}
