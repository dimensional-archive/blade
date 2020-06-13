import { Guild as ErisGuild } from "eris";
import { Context } from "./api/components/command";
declare module "eris" {
    interface Message {
        guild: ErisGuild;
        ctx: Context;
    }
}
export * from "./api";
export * from "./utils";
