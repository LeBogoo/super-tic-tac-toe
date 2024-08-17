import { PacketSystem } from "../packet-system";

export class BasePacket {
  constructor(public type: string) {}

  stringify(): string {
    if (PacketSystem.debug) console.log("Serializing " + this.type);

    return JSON.stringify(this, (key, value) => {
      if (PacketSystem.debug) console.log(key, value);

      if (value instanceof Map) {
        return {
          dataType: "Map",
          value: Array.from(value.entries()),
        };
      } else {
        return value;
      }
    });
  }

  static parse<T extends BasePacket>(eventString: string): T {
    if (PacketSystem.debug) console.log("Deserializing " + this.name);

    const parsed = JSON.parse(eventString, (key, value) => {
      if (PacketSystem.debug) console.log(key, value);
      if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
          return new Map(value.value);
        }
      }
      return value;
    });
    const event = new BasePacket(parsed.type);
    return Object.assign(event, parsed) as T;
  }
}
