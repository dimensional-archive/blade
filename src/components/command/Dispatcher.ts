import { Message, Store, Timers } from "@kyudiscord/neo";

import type { CommandHandler } from "./Handler";
import type { BladeClient } from "../../Client";
import type { Command } from "./Command";
import type { Context } from "./context/Context";
import { array, blade, isPromise } from "../../util";

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
   * @param handler
   * @param options
   */
  public constructor(handler: CommandHandler, public readonly options: DispatcherOptions = {}) {
    this.options = options = Object.assign(options, {
      contextSweepInterval: 3e5,
      contextLifetime: 3e5,
      prefix: [ "!" ],
      mentionPrefix: true,
      passive: false,
      ignorePermissions: [],
      ignoreRatelimit: [],
      developers: []
    } as DispatcherOptions);

    this.handler = handler;
    this.client = handler.client;
    this.contexts = new Store();

    if (options.contextSweepInterval! > 0) this._initContextSweeper();
    if (!options.passive) {
      this.client.on("messageCreate", (message) => this.handle(message));
      this.client.on("messageUpdate", (_, message) => this.handle(message));
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

    if (this.aloneRegexp.test(message.content)) {
      this.handler.emit("onlyMention", ctx);
      return;
    }

    let prefix;
    if (this.mentionRegexp.test(message.content)) {
      if (!this.options.mentionPrefix) return;
      const [ _prf ] = this.mentionRegexp.exec(message.content)!;
      prefix = _prf;
    } else prefix = await this.parsePrefixes(ctx, message.content);

    if (!prefix) return;

    const [ cmd ] = message.content.slice(prefix.length).trim().split(" ");
    const command = this.findCommand(cmd);

    if (!command) return this.handler.emit("incorrectCommand", ctx, cmd);
    if (!await this.runPostInhibitors(ctx, command)) return;

    try {
      await command.run(ctx);
      this.handler.emit("commandRan", ctx, command);
    } catch (e) {
      this.handler.emit("commandError", ctx, command, e);
    }
  }

  private async runPostInhibitors(ctx: Context, command: Command): Promise<boolean> {
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

    if (!await this._checkPermissions(ctx, command)) return false;
    return await this._checkRatelimits(ctx, command);
  }

  /**
   * @private
   */
  private async _checkPermissions(ctx: Context, command: Command): Promise<boolean> {
    if (command.clientPerms) {
      if (typeof command.clientPerms === "function") {
        let missing = command.clientPerms(ctx);
        if (isPromise(missing)) missing = await missing;
        if (missing !== null) {
          this.handler.emit("missingPermissions", ctx, command, "client", missing);
          return false;
        }
      } else if (ctx.guild) {
        const missing = ctx.guild.me!.permissionsIn(ctx.channel as any).missing(command.clientPerms);
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
          const missing = ctx.member!.permissionsIn(ctx.channel as any).missing(command.memberPerms);
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
    const ignore = command.ignorePermissions ?? this.options.ignorePermissions!;
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
        }, expiresAt)
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
   * Parse prefixes.
   * @param ctx
   * @param content
   */
  private async parsePrefixes(ctx: Context, content: string): Promise<string | null> {
    let prefixes = typeof this.options.prefix === "function"
      ? this.options.prefix.apply(this.client, [ ctx ])
      : array(this.options.prefix!);

    if (isPromise(prefixes)) prefixes = await prefixes;
    prefixes = array(prefixes);

    for (const prefix of prefixes) {
      const regex = new RegExp(`^${prefix}`, "i");
      if (regex.test(content)) return prefix;
    }

    return null;
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
}
