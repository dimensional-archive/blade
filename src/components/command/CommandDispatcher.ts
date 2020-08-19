import { GuildChannel, Message, Store, Timers } from "@kyudiscord/neo";
import { array, blade, isPromise } from "../../util";
import { ContentParser } from "./parameter/parser/ContentParser";
import { TypeResolver } from "./parameter/TypeResolver";

import type { CommandHandler } from "./CommandHandler";
import type { BladeClient } from "../../Client";
import type { Command } from "./Command";
import type { Context } from "./context/Context";
import type { InhibitorHandler } from "../inhibitor/InhibitorHandler";

export class CommandDispatcher {
  /**
   * The command handler.
   */
  public readonly handler: CommandHandler;

  /**
   * The client instance.
   */
  public readonly client: BladeClient;

  /**
   * All contexts.
   */
  public readonly contexts: Store<string, Context>;

  /**
   * The type resolver.
   */
  public readonly resolver: TypeResolver;

  /**
   * The inhibitor handler.
   */
  public inhibitorHandler?: InhibitorHandler;

  /**
   * @param handler
   * @param options
   */
  public constructor(handler: CommandHandler, public readonly options: DispatcherOptions = {}) {
    this.options = options = Object.assign({
      contextSweepInterval: 3e5,
      contextLifetime: 3e5,
      prefix: [ "!" ],
      mentionPrefix: true,
      passive: false,
      ignorePermissions: [],
      ignoreRatelimit: [],
      developers: []
    } as DispatcherOptions, options);

    this.resolver = new TypeResolver(handler.client);
    this.handler = handler;
    this.client = handler.client;
    this.contexts = new Store();
    this.inhibitorHandler = options.inhibitorHandler;

    if (options.contextSweepInterval! > 0) this._initContextSweeper();
    if (!options.passive) {
      this.client.on("messageCreate", (message) => void this.handle(message));
      this.client.on("messageUpdate", (_, message) => void this.handle(message));
    }
  }

  /**
   * A regexp for testing if the prefix is the client mention.
   */
  public get mentionRegexp(): RegExp {
    return new RegExp(`^<@!${this.client.user!.id}>`);
  }

  /**
   * A regexp for testing whether or not message content only includes a mention.
   */
  public get aloneRegexp(): RegExp {
    return new RegExp(`^<@!${this.client.user!.id}>$`);
  }

  /**
   * Use an inhibitor handler when dispatching commands.
   * @param inhibitorHandler The handler to use.
   * @since 1.0.3
   */
  public useInhibitors(inhibitorHandler: InhibitorHandler): this {
    this.inhibitorHandler = inhibitorHandler;
    return this;
  }

  /**
   * Handles an incoming message.
   * @param message
   */
  public async handle(message: Message): Promise<unknown> {
    if (message.author.bot) return;

    let ctx = this.contexts.get(message.id);
    if (!ctx) {
      ctx = new (blade.get("Context"))(this, message);
      this.contexts.set(message.id, ctx);
    }

    message.ctx = ctx;

    // Run all of the "all" type inhibitors.
    if (!(await this.runAllInhibitors(ctx))) {
      void this.contexts.delete(message.id);
      delete message.ctx;
      return;
    }

    // Tests whether or not the message content only contains the client mention
    if (this.aloneRegexp.test(message.content)) {
      this.handler.emit("onlyMention", ctx);
      return;
    }

    // Find a prefix.
    let prefix;
    if (this.mentionRegexp.test(message.content)) {
      if (!this.options.mentionPrefix) return;
      const [ _prf ] = this.mentionRegexp.exec(message.content)!;
      prefix = _prf;
    } else {
      let prefixes = typeof this.options.prefix === "function"
        ? this.options.prefix.apply(this.client, [ ctx ])
        : array(this.options.prefix!);

      if (isPromise(prefixes)) prefixes = await prefixes;
      prefixes = array(prefixes);

      for (const prefix1 of prefixes) {
        const regex = new RegExp(`^${prefix1}`, "i");
        if (regex.test(message.content)) prefix = prefix1;
        if (prefix) break;
      }
    }

    if (!prefix) return;
    if (!(await this.runPreCommandInhibitors(ctx))) return;

    // Split the message content.
    const [ cmd, ...args ] = message.content
      .slice(prefix.length)
      .trim()
      .split(" ");

    const command = this.findCommand(cmd);

    // Run an incorrect command check and post inhibitors.
    if (!command) return this.handler.emit("incorrectCommand", ctx, cmd);
    if (!await this.runCommandInhibitors(ctx, command)) return;

    // Parse the message arguments.
    let params: unknown[] | Promise<unknown[]>;
    if (typeof command.params === "object") {
      const { flagKeys, optionKeys } = await ContentParser.getFlags(command.params);
      const name = (n: string) => n.replace(/^-+/, "").trim();
      const parsed = new ContentParser({
        optionKeys,
        flagKeys,
        quoted: command.quoted
      }).parse(args.join(" "));

      for (const flag of parsed.flags) ctx.flags.set(name(flag.key!), true);
      for (const flag of parsed.options) ctx.flags.set(name(flag.key!), flag.value);

      params = parsed.phrases.map(p => p.value!);
    } else params = args;

    // Resolve the arguments or if an error is caught emit an event.
    try {
      params = command.options.resolver
        ? command.options.resolver.call(command, params as string[], ctx)
        : params;

      if (isPromise(params)) params = await params;
    } catch (e) {
      return this.handler.emit("resolveError", command, ctx, params, e);
    }

    // Run the command or if an error is caught emit an event..
    try {
      await command.run(ctx, params);
      return this.handler.emit("commandRan", ctx, command);
    } catch (e) {
      return this.handler.emit("commandError", ctx, command, e);
    }
  }

  /**
   * @private
   */
  private async runAllInhibitors(ctx: Context): Promise<boolean> {
    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test("all", ctx)
      : null;

    if (reason !== null) this.handler.emit("messageBlocked", ctx, reason);
    else return true;
    return false;
  }

  /**
   * @private
   */
  private async runPreCommandInhibitors(ctx: Context): Promise<boolean> {
    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test("pre-command", ctx)
      : null;

    if (reason !== null) this.handler.emit("messageBlocked", ctx, reason);
    else return true;
    return false;
  }

  /**
   * @private
   */
  private async runCommandInhibitors(ctx: Context, command: Command): Promise<boolean> {
    if (command.developerOnly) {
      if (!this.options.developers?.includes(ctx.author.id)) {
        this.handler.emit("commandBlocked", ctx, command, "developerOnly");
        return false;
      }
    }

    if (command.runIn === "guild" && !ctx.guild) {
      this.handler.emit("commandBlocked", ctx, command, "guild");
      return false;
    }

    if (command.runIn === "dm" && ctx.guild) {
      this.handler.emit("commandBlocked", ctx, command, "dm");
      return false;
    }

    const reason = this.inhibitorHandler
      ? await this.inhibitorHandler.test("command", ctx)
      : null;

    if (reason !== null) {
      this.handler.emit("commandBlocked", ctx, command, reason);
      return false;
    }

    if (!await this._checkPermissions(ctx, command)) return false;
    return await this._checkRatelimits(ctx, command);
  }

  /**
   * @private
   */
  private async _checkPermissions(ctx: Context, command: Command): Promise<boolean> {
    const channel = ctx.channel as GuildChannel;
    if (command.clientPerms) {
      if (typeof command.clientPerms === "function") {
        let missing = command.clientPerms(ctx);
        if (isPromise(missing)) missing = await missing;
        if (missing !== null) {
          this.handler.emit("missingPermissions", ctx, command, "client", missing);
          return false;
        }
      } else if (ctx.guild) {
        const missing = ctx.guild.me!.permissionsIn(channel).missing(command.clientPerms);
        if (missing.length) {
          this.handler.emit("missingPermissions", ctx, command, "client", missing);
          return false;
        }
      }
    }

    if (command.memberPerms) {
      const ignore = command.ignorePermissions ?? this.options.ignorePermissions!;
      const isIgnored = Array.isArray(ignore)
        ? ignore.includes(ctx.author.id)
        : typeof ignore === "function"
          ? await ignore(ctx, command)
          : false;

      if (!isIgnored) {
        if (typeof command.memberPerms === "function") {
          let missing = command.memberPerms(ctx);
          if (isPromise(missing)) missing = await missing;
          if (missing !== null) {
            this.handler.emit("missingPermissions", ctx, command, "member", missing);
            return false;
          }
        } else if (ctx.guild) {
          const missing = ctx.member!.permissionsIn(channel).missing(command.memberPerms);
          if (missing.length) {
            this.handler.emit("missingPermissions", ctx, command, "member", missing);
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * @private
   */
  private async _checkRatelimits(ctx: Context, command: Command): Promise<boolean> {
    const ignore = this.options.ignoreRatelimit;
    const isIgnored = Array.isArray(ignore)
      ? ignore.includes(ctx.author.id)
      : typeof ignore === "function"
        ? await ignore(ctx, command)
        : false;

    if (isIgnored) return true;

    const expiresAt = ctx.message.createdTimestamp + command.ratelimit.cooldown;
    const id = command.ratelimit.type === "user"
      ? ctx.author.id
      : command.ratelimit.type === "channel"
        ? ctx.channel.id
        : ctx.guild?.id ?? ctx.author.id;

    let ratelimit = command.ratelimits.get(id);
    if (!ratelimit) {
      command.ratelimits.set(id, {
        expiresAt,
        bucket: command.ratelimit.bucket,
        timeout: Timers.setTimeout(() => {
          if (command.ratelimits.get(id)) {
            Timers.clearTimeout(command.ratelimits.get(id)!.timeout);
          }

          command.ratelimits.delete(id);
        }, command.ratelimit.cooldown)
      });

      ratelimit = command.ratelimits.get(id)!;
    }

    if (ratelimit.bucket === 0) {
      const expiresAt = command.ratelimits.get(id)!.expiresAt;
      this.handler.emit("ratelimited", ctx, command, expiresAt - ctx.message.createdTimestamp);
      return false;
    }

    ratelimit.bucket--;
    return true;
  }

  /**
   * Finds a command based off a string.
   * @param identifier
   */
  private findCommand(identifier: string): Command | undefined {
    return this.handler.store.find(c => c.triggers.some(t => t.toLowerCase() === identifier.toLowerCase()));
  }

  /**
   * Initializes the context sweeper.
   * @private
   */
  private _initContextSweeper() {
    Timers.setInterval(() => {
      let count = 0;
      for (const ctx of this.contexts.values()) {
        const now = Date.now();
        if (now - (ctx.message.editedTimestamp || ctx.message.createdTimestamp) > this.options.contextLifetime!) {
          count++;
          this.contexts.delete(ctx.message.id);
        }
      }

      this.handler.emit("dispatcherDebug", `Swept ${count} Contexts.`);
    }, this.options.contextSweepInterval ?? 3e5);
  }
}

export type IgnorePermissions = (ctx: Context, command: Command) => boolean | Promise<boolean>;

export type IgnoreCooldown = (ctx: Context, command: Command) => boolean | Promise<boolean>;

export type PrefixProvider = (this: BladeClient, ctx: Context) => string | string[] | Promise<string | string[]>;

export interface DispatcherOptions {
  developers?: string[];
  prefix?: string | string[] | PrefixProvider;
  contextSweepInterval?: number;
  contextLifetime?: number;
  mentionPrefix?: boolean;
  ignoreRatelimit?: string[] | IgnoreCooldown;
  ignorePermissions?: string[] | IgnorePermissions;
  passive?: boolean;
  inhibitorHandler?: InhibitorHandler;
}
