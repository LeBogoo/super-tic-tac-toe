import { BasePacket } from "../base-packet";

export class GameStoppedPacket extends BasePacket {
  constructor() {
    super("game_stopped");
  }
}
