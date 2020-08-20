import { PermissionResolvable, Store } from "@kyudiscord/neo";
import { Category, Duration } from "../../util";
import { Module, ModuleOptions } from "../base/Module";

import type { BladeClient } from "../../Client";
import type { Context } from "./context/Context";
import type { CommandDispatcher, IgnorePermissions } from "./CommandDispatcher";
import type { TypeBuilder } from "./parameter/TypeBuilder";
import type { ParamType } from "./parameter/TypeResolver";
import type { CommandHandler } from "./CommandHandler";
import type { TFunction } from "../language/Language";

export const RATELIMIT_REGEXP = /^(?:(channel|user|guild):)?(\d+)\/(\d+[smhwd])$/i;
export const ratelimitDefaults: CommandRatelimit = { bucket: 1, cooldown: 5000, type: "user" };

export class Command extends Module<CommandOptions> {
  /**
   * Ratelimits for this command
   */
  public readonly ratelimits: Store<string, Ratelimit>;

  /**
   * The commands handler.
   */
  public handler!: CommandHandler;

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
   * Parameters given to this command.
   */
  public params: Dictionary<ParameterOptions> | boolean;

  /**
   * This command's usage.
   */
  public usage: string;

  /**
   * The description of this command.
   */
  public description: string | Translatable;

  /**
   * Example usages of this command.
   */
  public examples: string[] | Translatable<string[]>;

  /**
   * Extended description content.
   */
  public extendedDescription?: string | Translatable;

  /**
   * Whether or not this command can only be ran by developers/
   */
  public developerOnly: boolean;

  /**
   * IDs that will bypass permission checks.
   */
  public ignorePermissions: string[] | IgnorePermissions;

  /**
   * Whether or not to parse quoted content.
   */
  public quoted: boolean;

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

    this.developerOnly = options.developerOnly ?? false;

    this.params = options.params ?? {};

    this.quoted = options.quoted ?? true;

    this.description = (typeof options.description === "function"
      ? options.description.bind(this)
      : options.description) ?? "This command has no description.";

    this.examples = (typeof options.examples === "function"
      ? options.examples.bind(this)
      : options.examples) ?? [];

    this.extendedDescription = typeof options.extendedDescription === "function"
      ? options.extendedDescription.bind(this)
      : options.extendedDescription;

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
   * The command dispatcher.
   */
  public get dispatcher(): CommandDispatcher {
    return this.handler.dispatcher;
  }

  /**
   * The ratelimit options for this command.
   */
  public get ratelimit(): CommandRatelimit {
    if (!this.options.ratelimit) return ratelimitDefaults;

    const res = RATELIMIT_REGEXP.exec(this.options.ratelimit);
    return !res
      ? ratelimitDefaults
      : {
        type: (res[1] ?? "user") as RatelimitType,
        bucket: parseInt(res[2]),
        cooldown: Duration.parse(res[3])
      };
  }

  /**
   * The category this command is in.
   */
  public get category(): Category<Command> {
    return this.handler.categories.get(this.categoryId)!;
  }

  /**
   * Called whenever a message matches any of the provided triggers.
   * @param ctx The command context.
   * @param args
   * @since 1.0.0
   */
  public run(ctx: Context, args: Array<string | unknown>): unknown {
    void (ctx);
    void (args);
    return;
  }
}

/**
 * A helper decorator for applying options to a command.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function command(options: CommandOptions = {}) {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

/**
 * The type of channel to run the command in.
 */
export type RunIn = "guild" | "dm";

/**
 * The typeof command ratelimit.
 */
export type RatelimitType = "user" | "channel" | "guild";

/**
 * The permissions handler.
 */
export type Permissions = (ctx: Context) => void | null | Promise<void | null>;

/**
 * Provides the parameter a default value.
 */
export type DefaultProvider = ((ctx: Context) => unknown | Promise<unknown>);

/**
 * Used for creating advanced parameter types.
 */
export type TypeBuilderProvider = ((b: TypeBuilder) => TypeBuilder | Promise<TypeBuilder>);

/**
 * Used for translating shit.
 */
export type Translatable<T = string> = (t: TFunction<T>) => Promise<string>

export interface CommandOptions extends ModuleOptions {
  /**
   * The phrases that trigger this command.
   */
  triggers?: string[];
  /**
   * The usage of this command.
   */
  usage?: string;
  /**
   * The command description.
   */
  description?: string | Translatable;
  /**
   * Example usages of this command.
   */
  examples?: string[] | Translatable<string[]>;
  /**
   * Extended help for this command.
   */
  extendedDescription?: string | Translatable;
  /**
   * The typeof channel that is required for this command to be ran.
   */
  runIn?: RunIn;
  /**
   * Whether or not this command can only be ran by developers.
   */
  developerOnly?: boolean;
  /**
   * The ratelimit for this command.
   */
  ratelimit?: string;
  /**
   * The permissions the client needs for this command to be ran.
   */
  clientPerms?: PermissionResolvable[] | Permissions;
  /**
   * The permissions the command invoker needs for this command to be ran.
   */
  memberPerms?: PermissionResolvable[] | Permissions;
  /**
   * The users that the permission check will ignore.
   */
  ignorePermissions?: string[] | IgnorePermissions;
  /**
   * The parameters to parse.
   */
  params?: Dictionary<ParameterOptions> | boolean;
  /**
   * The resolver to use when parsing commands.
   * @param phrases Parsed phrases.
   * @param ctx The context.
   */
  resolver?: (phrases: string[], ctx: Context) => unknown[] | Promise<unknown[]>;
  /**
   * Whether or not parameters are quoted.
   */
  quoted?: boolean;
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

export interface ParameterOptions {
  prompt?: PromptOptions;
  type: ParamType | TypeBuilderProvider;
  default?: unknown | DefaultProvider;
  index?: number;
  unordered?: boolean;
}

export interface PromptOptions {
  start?: string;
  retry?: string;
  tries?: number;
  time?: number | string;
}

@command()
export class Ping extends Command {
}
