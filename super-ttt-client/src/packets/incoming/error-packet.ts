import { BasePacket } from "../base-packet";

export class ErrorPacket extends BasePacket {
  constructor(public errorMessage: string, public data: unknown) {
    super("error");
  }
}
