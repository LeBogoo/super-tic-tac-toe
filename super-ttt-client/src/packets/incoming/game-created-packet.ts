import { BasePacket } from "../base-packet";

export class GameCreatedPacket extends BasePacket {
  constructor(public gameCode: string) {
    super("game_created");
  }
}
