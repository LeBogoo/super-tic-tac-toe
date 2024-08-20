import { BasePacket } from "../base-packet";

export class ConnectionInformationEvent extends BasePacket {
  constructor(public message: string) {
    super("connection_information");
  }
}
