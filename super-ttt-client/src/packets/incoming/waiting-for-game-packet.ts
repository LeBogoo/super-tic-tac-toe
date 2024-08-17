import { BasePacket } from "../base-packet";

export class WaitingForGamePacket extends BasePacket {
  constructor() {
    super("waiting_for_game");
  }
}
