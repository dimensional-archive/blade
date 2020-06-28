import { TextChannel, Structures, Guild, Textable } from "@kyu/eris";
import { Context } from "./api/components/command";

declare module "@kyu/eris" {
  interface Message {
    guild: Guild;
    ctx: Context;
  }
}

Structures.extend(
  "Message",
  (Message) =>
    class KyuMessage<T extends Textable> extends Message<T> {
      get guild(): Guild {
        return (this.channel instanceof TextChannel
          ? this.channel.guild
          : undefined)!;
      }
    }
);

export * from "./api";
export * from "./utils";
