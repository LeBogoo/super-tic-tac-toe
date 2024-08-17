import { TTTSymbol } from "../../ttt-symbol";
import { BasePacket } from "../base-packet";

export class GameJoinedPacket extends BasePacket {
  constructor(public playerSymbol: TTTSymbol) {
    super("game_joined");
  }
}
