import { BasePacket } from "../base-packet";

export class SetCellPacket extends BasePacket {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {
    super("set_cell");
  }
}
