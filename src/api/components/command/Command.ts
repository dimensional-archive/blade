import { Component } from "../Base";
import { Util } from "../../../utils/Util";

import type { CommandStore } from "../../stores/Command";
import type { AllowedChannels, CommandArgument, CommandDescription, CommandOptions, Restrictions } from "../Types";
import type { Permission } from "eris";
import { Context } from "./Context";
import { MethodNotImplementedError } from "@ayanaware/errors";
import { Message } from "eris";

export class Command extends Component {
  public readonly store!: CommandStore;

  public description: CommandDescription;
  public args: CommandArgument[];
  public restrictions: Restrictions[];
  public channel: AllowedChannels[];
  public userPermissions: Permission[];
  public permissions: Permission[];
  public inhibitors: string[];
  public editable: boolean;

  public constructor(store: CommandStore, path: string, options: CommandOptions = {}) {
    super(store, path, options);

    this.description = options.description ?? {}
    this.args = options.args ?? [];
    this.restrictions = options.restrictions ? Util.array(options.restrictions) : [];
    this.channel = options.channel ? Util.array(options.channel) : ["dm", "text"];
    this.userPermissions = options.userPermissions ? Util.array(options.userPermissions) : [];
    this.permissions = options.permissions ? Util.array(options.permissions) : [];
    this.inhibitors = options.inhibitors ? Util.array(options.inhibitors) : [];
    this.editable = options.editable ?? true;
  }

  public async exec(ctx: Context, args?: any[]): Promise<any> {
    throw new MethodNotImplementedError();
  }

  public static Setup(options: CommandOptions = {}) {
    return Component.Setup(options);
  }
}

@Command.Setup({ name: "hello" })
export class HelloCommand extends Command {
  public async exec(ctx: Context): Promise<Message> {
    return ctx.reply(b => b.content("Hello!"));
  }
}
