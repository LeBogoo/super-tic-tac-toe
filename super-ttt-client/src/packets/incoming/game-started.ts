import { BasePacket } from "../base-packet";

export class GameStartedPacket extends BasePacket {
  constructor(public xEmoji: string, public oEmoji: string) {
    super("game_started");
  }
}
