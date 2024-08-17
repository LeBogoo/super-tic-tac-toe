import { BasePacket } from "../base-packet";

export class StopSearchPacket extends BasePacket {
  constructor() {
    super("stop_search");
  }
}
