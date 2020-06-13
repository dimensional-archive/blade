import { Message, TextChannel, Guild as ErisGuild } from "eris";
import { Context } from "./api/components/command";

declare module "eris" {
  interface Message {
    guild: ErisGuild;
    ctx: Context;
  }
}

Object.defineProperty(Message.prototype, "guild", {
  get(this: Message): any {
    return this.channel instanceof TextChannel
      ? this.channel.guild
      : undefined;
  }
})

export * from "./api";
export * from "./utils";
