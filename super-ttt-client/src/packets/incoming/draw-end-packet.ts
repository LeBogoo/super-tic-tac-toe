import { BasePacket } from "../base-packet";

export class DrawEndPacket extends BasePacket {
  constructor() {
    super("draw_end");
  }
}
