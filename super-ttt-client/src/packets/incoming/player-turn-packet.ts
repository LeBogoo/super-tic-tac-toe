import { TTTSymbol } from "../../ttt-symbol";
import { BasePacket } from "../base-packet";

export class PlayerTurnPacket extends BasePacket {
  constructor(public cell: TTTSymbol) {
    super("player_turn");
  }
}
