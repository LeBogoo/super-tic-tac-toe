import { TTTSymbol } from "../../ttt-symbol";
import { BasePacket } from "../base-packet";

export class WinEndPacket extends BasePacket {
  constructor(public winner: TTTSymbol) {
    super("win_end");
  }
}
