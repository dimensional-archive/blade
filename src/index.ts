import { TextChannel, Message, Guild as ErisGuild } from "eris";
import { Context } from "./command";

export * from "./Client";
export * from "./Structures";

export * from "./command";
export * from "./structures";
export * from "./util";

declare module "eris" {
  interface Message {
    guild: ErisGuild;
    ctx: Context;
  }
}

Object.defineProperty(Message.prototype, "guild", {
  get() {
    return (this.channel instanceof TextChannel
      ? this.channel.guild
      : undefined)!;
  }
})
