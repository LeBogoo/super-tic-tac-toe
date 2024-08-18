import { BasePacket } from "../base-packet";

export class ResetGamePacket extends BasePacket {
  constructor() {
    super("reset_game");
  }
}
