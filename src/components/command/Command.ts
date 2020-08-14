import { Store } from "@kyudiscord/neo";
import { blade, Duration } from "../../util";

import type { Permission, PermissionResolvable } from "@kyudiscord/neo";
import type { BladeClient } from "../../Client";
import type { ModuleOptions } from "../base/Module";
import type { Context } from "./context/Context";
import type { IgnorePermissions } from "./Dispatcher";

export const RATELIMIT_REGEXP = /^(?:(channel|user|guild):)?(\d+)\/(\d+[smhwd])$/i;
export const ratelimitDefaults: CommandRatelimit = { bucket: 1, cooldown: 5000, type: "user" };

export class Command extends blade.get("Module") {
  /**
   * Ratelimits for this command
   */
  public readonly ratelimits: Store<string, Ratelimit>;

  /**
   * The environments this command can be ran in.
   */
  public runIn?: RunIn;

  /**
   * Triggers for this command.
   */
  public triggers: string[];

  /**
   * Permissions the client needs for this command to be ran.
   */
  public clientPerms: PermissionResolvable[] | Permissions;

  /**
   * Permissions the invoker needs to run the command.
   */
  public memberPerms: PermissionResolvable[] | Permissions;

  /**
   * This command's usage.
   */
  public usage: string;

  /**
   * The description of this command.
   */
  public description: string;

  /**
   * Example usages of this command.
   */
  public examples: string[];

  /**
   * Extended description content.
   */
  public extendedDescription?: string;

  /**
   * Whether or not this command can only be ran by developers/
   */
  public developerOnly: boolean;

  /**
   * IDs that will bypass permission checks.
   */
  public ignorePermissions: string[] | IgnorePermissions;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, public readonly options: CommandOptions = {}) {
    super(client, options);

    this.ratelimits = new Store();

    this.runIn = options.runIn;
    this.triggers = options.triggers ?? [];
    this.usage = options.usage ?? "";
    this.description = options.description ?? "This command has no description.";
    this.examples = options.examples ?? [];
    this.extendedDescription = options.extendedDescription;
    this.developerOnly = options.developerOnly ?? false;
    this.clientPerms = typeof options.clientPerms === "function"
      ? options.clientPerms.bind(this)
      : options.clientPerms ?? [];
    this.memberPerms = typeof options.memberPerms === "function"
      ? options.memberPerms.bind(this)
      : options.memberPerms ?? [];
    this.ignorePermissions = typeof options.ignorePermissions === "function"
      ? options.ignorePermissions.bind(this)
      : options.ignorePermissions ?? [];
    this.run = this.run.bind(this);
  }

  /**
   * The ratelimit options for this command.
   */
  public get ratelimit(): CommandRatelimit {
    if (!this.options.ratelimit) return ratelimitDefaults;

    const res = RATELIMIT_REGEXP.exec(this.options.ratelimit);
    return res
      ? {
        type: (res[1] ?? "user") as RatelimitType,
        bucket: parseInt(res[2]),
        cooldown: Duration.parse(res[3])
      }
      : ratelimitDefaults;
  }

  /**
   * Called whenever a message matches any of the provided triggers.
   * @param ctx The command context.
   * @since 1.0.0
   */
  public async run(ctx: Context): Promise<unknown> {
    await ctx.message.react(":x:");
    return;
  }
}

export type RunIn = "guild" | "dm";
export type RatelimitType = "user" | "channel" | "guild";
export type Permissions = (ctx: Context) => void | null | Promise<void | null>;

export interface CommandOptions extends ModuleOptions {
  triggers?: string[];
  usage?: string;
  description?: string;
  examples?: string[];
  extendedDescription?: string;
  runIn?: RunIn;
  developerOnly?: boolean;
  ratelimit?: string;
  clientPerms?: Permission[] | Permissions;
  memberPerms?: Permission[] | Permissions;
  ignorePermissions?: string[] | IgnorePermissions;
}

export interface CommandRatelimit {
  bucket: number;
  cooldown: number;
  type: RatelimitType;
}

export interface Ratelimit {
  bucket: number;
  expiresAt: number;
  timeout: NodeJS.Timeout;
}
