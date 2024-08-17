import { BasePacket } from "../base-packet";

export class BoardUpdatePacket extends BasePacket {
  constructor(
    public board: {
      superCells: {
        cells: string[];
        active: boolean;
      }[];
    }
  ) {
    super("board_update");
  }
}
