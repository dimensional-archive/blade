import { PartOptions, Part } from "./base/Part";
import { Permission, Message } from "eris";
import { Util } from "../util";
import { ArgumentOptions, ArgumentGenerator, DefaultArgumentOptions, ContentParser, ArgumentRunner, Argument, Context } from "../command";

import type { IgnorePermissions, IgnoreCooldown, PrefixProvider, CommandStore } from "./CommandStore";

export type CooldownType = "author" | "channel";
export type Restrictions = "owner" | "guildOwner";
export type AllowedChannels = "text" | "dm";
export type RegexProvider = (ctx: Context) => RegExp | Promise<RegExp>;
export type Before = (ctx: Context) => boolean | Promise<boolean>;
export type KeySupplier = (ctx: Context, args?: any) => string;
export type ExecutionPredicate = (ctx: Context) => boolean;
export type TFunction<T = string> = (path: string, data?: Record<string, any>) => T;
export type GetTranslation<T = string> = (t: TFunction<T>) => T;

export interface CommandDescription {
  /**
   * The description content.
   */
  content?: string | GetTranslation;
  /**
   * Extended help for this command.
   */
  extendedContent?: string | GetTranslation;
  /**
   * How to use this command.
   */
  usage?: string | GetTranslation;
  /**
   * Examples of this command.
   */
  examples?: string[] | GetTranslation;
}

export interface CommandOptions extends PartOptions {
  /**
   * Command aliases to use.
   */
  aliases?: string[];
  /**
   * Description of the command.
   */
  description?: CommandDescription | GetTranslation<CommandDescription>;
  /**
   * The command arguments.
   */
  args?: ArgumentOptions[] | ArgumentGenerator;
  /**
   * Command Restrictions
   */
  restrictions?: Restrictions | Restrictions[];
  /**
   * Channel types that the command can be ran in.
   */
  channel?: AllowedChannels | AllowedChannels[];
  /**
   * Permissions needed by the invoker.
   */
  userPermissions?: Permission | Permission[];
  /**
   * Permissions needed by the client.
   */
  permissions?: Permission | Permission[];
  /**
   * Per-Command inhibitors to use.
   */
  inhibitors?: string | string[];
  /**
   * Whether this command is editable or not.
   */
  editable?: boolean;
  /**
   * The amount of times the command can be ran before being ratelimited.
   */
  bucket?: number;
  /**
   * The cooldown for this command.
   */
  cooldown?: number;
  /**
   * The cooldown type for this command.
   */
  cooldownType?: CooldownType;
  /**
   * Whether this command his hidden or not.
   */
  hidden?: boolean;
  /**
   * Whether this command is guarded or not.
   */
  guarded?: boolean;
  /**
   * User ID(s) or a function that will be ignored when checking permissions.
   */
  ignorePermissions?: string | string[] | IgnorePermissions;
  /**
   * User ID(s) or a function that will be ignored when checking cooldowns.
   */
  ignoreCooldown?: string | string[] | IgnoreCooldown;
  /**
   * Specific prefixes for this command.
   */
  prefixes?: string | string[] | PrefixProvider;
  /**
   * Default argument options for this command.
   */
  argumentDefaults?: DefaultArgumentOptions;
  /**
   * Use a regexp as a invoke.
   */
  regex?: RegExp | RegexProvider;
  /**
   * A method called before this command gets ran.
   */
  before?: Before;
  /**
   * A condition that allows this command to run.
   */
  condition?: ExecutionPredicate;
  flags?: string[];
  optionFlags?: string[];
  quoted?: boolean;
  separator?: string;
  lock?: "guild" | "channel" | "user" | KeySupplier;
}

/**
 * The base command class.
 * @since 1.0.0
 */
export class Command extends Part {
  public readonly locker: Set<KeySupplier> = new Set();
  /**
   * The command store.
   * @since 1.0.0
   */
  public readonly store!: CommandStore;
  /**
   * The aliases for this command.
   */
  public aliases: string[];
  /**
   * This commands description.
   * @since 1.0.0
   */
  public description: CommandDescription | GetTranslation<CommandDescription>;
  /**
   * Restrictions for this command.
   * @since 1.0.0
   */
  public restrictions: Restrictions[];
  /**
   * The channel types allowed to run this command.
   * @since 1.0.0
   */
  public channel: AllowedChannels[];
  /**
   * Permissions the invoker needs to run this command.
   * @since 1.0.0
   */
  public userPermissions: Permission[];
  /**
   * Permissions the bot needs before running this command.
   * @since 1.0.0
   */
  public permissions: Permission[];
  /**
   * Per-command inhibitors to run.
   * @since 1.0.0
   */
  public inhibitors: string[];
  /**
   * Whether this command can be edited or not.
   * @since 1.0.0
   */
  public editable: boolean;
  /**
   * The amount of times the command can be ran before being ratelimited.
   * @since 1.0.0
   */
  public bucket: number;
  /**
   * The cooldown for this command.
   * @since 1.0.0
   */
  public cooldown: number;
  /**
   * The cooldown type for this command.
   * @since 1.0.0
   */
  public cooldownType: CooldownType;
  /**
   * Whether this command his hidden or not.
   * @since 1.0.0
   */
  public hidden: boolean;
  /**
   * Whether this command is guarded or not.
   * @since 1.0.0
   */
  public guarded: boolean;
  /**
   * Specific prefixes for this command.
   * @since 1.0.0
   */
  public prefix: string[] | PrefixProvider | null;
  /**
   * Default argument options for this command.
   * @since 1.0.0
   */
  public argumentDefaults: DefaultArgumentOptions;
  /**
   * A method that gets called right before the command gets ran.
   * @since 1.0.0
   */
  public before: Before;
  /**
   * A condition method that gets called before this command runs.
   * @since 1.0.0
   */
  public condition: ExecutionPredicate;
  /**
   * Use a regexp as an invoke
   * @since 1.0.0
   */
  public regex: RegExp | RegexProvider | null;
  public lock: KeySupplier | null;

  #contentParser: ContentParser;
  #argumentGenerator: ArgumentGenerator;
  #argumentRunner: ArgumentRunner = new ArgumentRunner(this);

  /**
   * Creates a new Command.
   * @param store The command store.
   * @param dir The directory that holds this command/
   * @param file The path to this command.
   * @param options Options to use.
   */
  public constructor(
    store: CommandStore,
    dir: string,
    file: string[],
    options: CommandOptions = {}
  ) {
    super(store, dir, file, options);

    options = Util.deepAssign({ args: [] }, options);

    const { flagWords, optionFlagWords } = Array.isArray(options.args)
      ? ContentParser.getFlags(options.args)
      : { flagWords: options.flags, optionFlagWords: options.optionFlags };

    this.#contentParser = new ContentParser({
      flagWords,
      optionFlagWords,
      quoted: options.quoted ?? true,
      separator: options.separator,
    });

    this.#argumentGenerator = Array.isArray(options.args)
      ? ArgumentRunner.fromArguments(
          options.args!.map((arg) => [arg.id!, new Argument(this, arg)])
        )
      : options.args!.bind(this);

    this.argumentDefaults = options.argumentDefaults ?? {};
    this.aliases = [...(options.aliases ?? []), this.name];
    this.editable = options.editable ?? true;
    this.bucket = options.bucket ?? 1;
    this.cooldown = options.cooldown ?? 5000;
    this.cooldownType = options.cooldownType ?? "author";
    this.hidden = options.hidden ?? false;
    this.guarded = options.guarded ?? false;
    this.restrictions = options.restrictions
      ? Util.array(options.restrictions)
      : [];
    this.channel = options.channel
      ? Util.array(options.channel)
      : ["dm", "text"];
    this.userPermissions = options.userPermissions
      ? Util.array(options.userPermissions)
      : [];
    this.permissions = options.permissions
      ? Util.array(options.permissions)
      : [];
    this.inhibitors = options.inhibitors ? Util.array(options.inhibitors) : [];
    this.before = options.before ? options.before.bind(this) : () => true;
    this.description = options.description
      ? typeof options.description === "function"
        ? options.description.bind(this)
        : options.description
      : { content: "", usage: "" };
    this.prefix = options.prefixes
      ? typeof options.prefixes === "function"
        ? options.prefixes.bind(this)
        : Util.array(options.prefixes)
      : null;
    this.regex = options.regex
      ? typeof options.regex === "function"
        ? options.regex.bind(this)
        : options.regex
      : null;
    this.condition = options.condition
      ? options.condition.bind(this)
      : () => false;

    this.lock = options.lock as KeySupplier;

    if (typeof options.lock === "string") {
      this.lock = ({
        guild: (ctx) => ctx.guild && ctx.guild.id,
        channel: (ctx) => ctx.channel.id,
        user: (ctx) => ctx.author.id,
      } as Record<string, KeySupplier>)[options.lock];
    }
  }

  /**
   * Returns the bytecode of the required user permissions.
   * @since 1.0.0
   */
  public get userPermissionsBytecode(): number {
    return this.userPermissions.reduce((acc, perm) => (acc |= perm.allow), 0);
  }

  /**
   * Returns the bytecode of the required client permissions.
   * @since 1.0.0
   */
  public get permissionsBytecode(): number {
    return this.permissions.reduce((acc, perm) => (acc |= perm.allow), 0);
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this command.
   * @constructor
   */
  public static Setup(
    options: CommandOptions = {}
  ): <T extends new (...args: any[]) => Part>(t: T) => T {
    return Part.Setup(options);
  }

  /**
   * Parses the arguments of this command.
   * @param message
   * @param content
   */
  public parse(message: Message, content: string): Promise<any> {
    const parsed = this.#contentParser.parse(content);
    return this.#argumentRunner.run(message, parsed, this.#argumentGenerator);
  }
}
