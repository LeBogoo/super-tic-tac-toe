import { TTTSymbol } from "../../ttt-symbol";
import { BasePacket } from "../base-packet";

export class GGPacket extends BasePacket {
  constructor(public player: TTTSymbol) {
    super("gg");
  }
}
