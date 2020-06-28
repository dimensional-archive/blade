import { IllegalStateError } from "@ayanaware/errors";
import { Constants } from "@kyu/eris";
import type { Channel, Message, User } from "@kyu/eris";
import { Context, ContextData, InhibitorStore, Language, ListenerStore, MonitorStore, Storage, TypeResolver, Util } from "../..";
import { Permissions } from "../../utils/Permissions";
import type { BladeClient } from "../Client";
import { Components } from "../Components";
import { Command, DefaultArgumentOptions, Flag, RatelimitManager } from "../components/command/";
import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";


export type IgnorePermissions = (message: Message, command: Command) => boolean;
export type IgnoreCooldown = (message: Message, command: Command) => boolean;
export type PrefixProvider = (
  ctx: Context
) => string | string[] | Promise<string | string[]>;
export type LanguageGetter = (ctx: Context) => string | Language;

export interface HandlingOptions {
  /**
   * A method used for getting a language.
   */
  getLanguage?: LanguageGetter;
  /**
   * The prefixes to use.
   */
  prefix?: string | string[] | PrefixProvider;
  /**
   * Whether to handle command edits.
   */
  handleEdits?: boolean;
  /**
   * Whether you want the command handling enabled or not.
   */
  enabled?: boolean;
  /**
   * Whether to allow bot accounts to run commands.
   */
  allowBots?: boolean;
  /**
   * Whether to allow the client to run commands.
   */
  allowSelf?: boolean;
  /**
   * Whether to allow users to run commands.
   */
  allowUsers?: boolean;
  /**
   * ID of user(s) to ignore `userPermissions` checks or a function to ignore.
   */
  ignorePermissions?: string | string[] | IgnorePermissions;
  aliasReplacement?: RegExp;
  /**
   * ID of user(s) to ignore cooldown or a function to ignore.
   */
  ignoreCooldown?: string | string[] | IgnoreCooldown;
  /**
   * Whether to store messages.
   */
  storeMessages?: boolean;
  /**
   * Whether to send a typing indicator.
   */
  sendTyping?: boolean;
  /**
   * Default options for arguments.
   */
  argumentDefaults?: DefaultArgumentOptions;
}

export interface CommandStoreOptions extends ComponentStoreOptions {
  /**
   * Message handling options.
   */
  handling?: HandlingOptions;
  /**
   * The default command cooldown.
   */
  defaultCooldown?: number;
}

/**
 * A command store that handles loading of commands.
 */
export class CommandStore extends ComponentStore<Command> {
  public readonly types: TypeResolver;
  /**
   * The inhibitor store to use while handling messages.
   * @since 1.0.0
   */
  public inhibitors?: InhibitorStore;
  /**
   * Settings to use while handling
   * @since 1.0.0
   */
  public handling: HandlingOptions;
  /**
   * The default command cooldown.
   * @since 1.0.0
   * @default 5 seconds
   */
  public defaultCooldown: number;
  /**
   * An alias storage.
   * @since 1.0.0
   */
  public aliases: Storage<string, string> = new Storage();
  /**
   * A prefix storage.
   */
  public prefixes: Storage<
    string | PrefixProvider,
    Set<string>
  > = new Storage();

  /**
   * A map of cooldowns.
   * @since 1.0.0
   */
  private readonly cooldowns: WeakMap<
    Command,
    RatelimitManager
  > = new WeakMap();
  /**
   * A storage for prompts.
   * @since 1.0.0
   * @readonly
   */
  private readonly promptStorage: Storage<string, Set<string>> = new Storage();
  /**
   * A storage for contexts.
   * @since 1.0.0
   * @readonly
   */
  private readonly contextStorage: Storage<string, Context> = new Storage();

  /**
   * Creates a new Command Store
   * @param client The client that is using this command store.
   * @param options The options to give.
   */
  public constructor(client: BladeClient, options: CommandStoreOptions = {}) {
    super(client, "commands", {
      ...options,
      classToHandle: Command,
    });

    this.types = new TypeResolver(this);

    this.handling = Util.deepAssign(
      <HandlingOptions>{
        allowBots: false,
        allowSelf: false,
        allowUsers: true,
        enabled: true,
        ignoreCooldown: "",
        ignorePermissions: "",
        storeMessages: true,
        handleEdits: true,
        sendTyping: true,
        prefix: ["!"],
        getLanguage: () => "en-US",
        argumentDefaults: {
          prompt: {
            start: "",
            retry: "",
            timeout: "",
            ended: "",
            cancel: "",
            retries: 1,
            time: 30000,
            cancelWord: "cancel",
            stopWord: "stop",
            optional: false,
            infinite: false,
            limit: Infinity,
            breakout: true,
          },
        },
      },
      options.handling ?? {}
    );

    this.defaultCooldown = options.defaultCooldown ?? 5000;

    if (this.handling.enabled) {
      this.client.once("ready", () => {
        this.client.on("messageCreate", (message) => this.handle(message));

        if (this.handling.handleEdits) {
          this.client.on("messageUpdate", async (o, m) => {
            if (o.content === m?.content) return;
            if (this.handling.handleEdits) await this.handle(o);
          });
        }
      });
    }
  }

  /**
   * A wrapper for the super.add method
   * @param component
   * @since 1.0.0
   */
  public add(component: Command): Command | null {
    const command = super.add(component);
    if (!command) return null;

    for (let alias of command.aliases) {
      const conflict = this.aliases.get(alias.toLowerCase());
      if (conflict)
        throw new IllegalStateError(
          `Alias '${alias}' of '${command.name}' already exists on '${conflict}'`
        );

      alias = alias.toLowerCase();
      this.aliases.set(alias, command.name);
      if (this.handling.aliasReplacement) {
        const replacement = alias.replace(this.handling.aliasReplacement, "");

        if (replacement !== alias) {
          const replacementConflict = this.aliases.get(replacement);
          if (replacementConflict)
            throw new IllegalStateError(
              `Alias '${alias}' of '${command.name}' already exists on '${conflict}'`
            );

          this.aliases.set(replacement, command.name);
        }
      }
    }

    if (command.prefix != null) {
      let newEntry = false;

      if (Array.isArray(command.prefix)) {
        for (const prefix of command.prefix) {
          const prefixes = this.prefixes.get(prefix);
          if (prefixes) {
            prefixes.add(command.name);
          } else {
            this.prefixes.set(prefix, new Set([command.name]));
            newEntry = true;
          }
        }
      } else {
        const prefixes = this.prefixes.get(command.prefix);
        if (prefixes) {
          prefixes.add(command.name);
        } else {
          this.prefixes.set(command.prefix, new Set([command.name]));
          newEntry = true;
        }
      }

      if (newEntry) {
        this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) =>
          Util.prefixCompare(aKey!, bKey!)
        );
      }
    }

    return command;
  }

  /**
   * A wrapper for the super.remove method.
   * @param resolvable
   * @since 1.0.0
   */
  public remove(resolvable: ComponentResolvable<Command>): Command | null {
    const command = super.remove(resolvable);
    if (!command) return null;

    for (let alias of command.aliases) {
      alias = alias.toLowerCase();
      this.aliases.delete(alias);

      if (this.handling.aliasReplacement) {
        const replacement = alias.replace(this.handling.aliasReplacement, "");
        if (replacement !== alias) this.aliases.delete(replacement);
      }
    }

    if (command.prefix != null) {
      if (Array.isArray(command.prefix)) {
        for (const prefix of command.prefix) {
          const prefixes = this.prefixes.get(prefix)!;
          if (prefixes.size === 1) {
            this.prefixes.delete(prefix);
          } else {
            prefixes.delete(prefix);
          }
        }
      } else {
        const prefixes = this.prefixes.get(command.prefix)!;
        if (prefixes.size === 1) {
          this.prefixes.delete(command.prefix);
        } else {
          prefixes.delete(command.prefix as any);
        }
      }
    }

    return command;
  }

  public useInhibitorStore(inhibitorStore: InhibitorStore): this {
    this.inhibitors = inhibitorStore;
    this.types.inhibitors = inhibitorStore;
    return this;
  }

  public useMonitorStore(inhibitorStore: MonitorStore): this {
    this.types.monitors = inhibitorStore;
    return this;
  }

  public useListenersStore(listenerStore: ListenerStore): this {
    this.types.listeners = listenerStore;
    return this;
  }

  /**
   * Finds a command
   * @param id
   */
  public findCommand(id: string): Command | undefined {
    return this.components.get(this.aliases.get(id.toLowerCase())!);
  }

  // Command Handling

  /**
   * Handles a sent message.
   * @param message The received message.
   * @since 1.0.0
   */
  public async handle(message: Message): Promise<boolean> {
    try {
      if (await this.runAllTypeInhibitors(message)) return false;

      if (this.contextStorage.has(message.id)) {
        message.ctx = this.contextStorage.get(message.id)!;
      } else {
        message.ctx = new (Components.get("context"))(this, message);
        this.contextStorage.set(message.id, message.ctx);
      }

      if (await this.runPreTypeInhibitors(message)) return false;

      let parsed = await this.parseCommand(message);
      if (!parsed.command) {
        const overParsed = await this.parseCommandOverwrittenPrefixes(message);
        if (
          overParsed.command ||
          (parsed.prefix == null && overParsed.prefix != null)
        ) {
          parsed = overParsed;
        }
      }

      let ran: ContextData | boolean | void | null;
      if (!parsed.command) {
        ran = await this.handleRegexAndConditionalCommands(message);
      } else {
        ran = await this.handleDirectCommand(
          message,
          parsed.content!,
          parsed.command
        );
      }

      if (ran === false) {
        this.emit(CommandStoreEvents.MESSAGE_INVALID, message.ctx);
        return false;
      }

      return ran as boolean;
    } catch (e) {
      this.emit("error", e, message);
      return false;
    }
  }

  public async handleRegexAndConditionalCommands(
    message: Message
  ): Promise<boolean> {
    const ran1 = await this.handleRegexCommands(message);
    const ran2 = await this.handleConditionalCommands(message);
    return ran1 || ran2;
  }

  public async handleRegexCommands(message: Message): Promise<boolean> {
    const hasRegexCommands: { command: Command; regex: RegExp }[] = [];
    for (const command of this.components.values()) {
      if (message.editedTimestamp ? command.editable : true) {
        const regex =
          typeof command.regex === "function"
            ? await command.regex(message.ctx)
            : command.regex;
        if (regex) hasRegexCommands.push({ command, regex });
      }
    }

    const matchedCommands: any[] = [];
    for (const entry of hasRegexCommands) {
      console.log(entry);
      const match = message.content.match(entry.regex);
      if (!match) continue;

      const matches: any[] = [];

      if (entry.regex.global) {
        let matched;

        while ((matched = entry.regex.exec(message.content)) != null) {
          matches.push(matched);
        }
      }

      matchedCommands.push({ command: entry.command, match, matches });
    }

    if (!matchedCommands.length) {
      return false;
    }

    const promises: Promise<any>[] = [];
    for (const { command, match, matches } of matchedCommands) {
      promises.push(
        (async () => {
          try {
            if (await this.runPostTypeInhibitors(message, command)) return;
            const before = command.before(message.ctx);
            if (Util.isPromise(before)) await before;
            await this.runCommand(message, command, { match, matches });
          } catch (err) {
            this.emit("error", err, message, command);
          }
        })()
      );
    }

    await Promise.all(promises);
    return true;
  }

  public async handleConditionalCommands(message: Message): Promise<boolean> {
    const trueCommands = this.components.filter(
      (command) =>
        (message.editedTimestamp ? command.editable : true) &&
        command.condition(message.ctx)
    );

    if (!trueCommands.size) {
      return false;
    }

    const promises: Promise<any>[] = [];
    for (const command of trueCommands.values()) {
      promises.push(
        (async () => {
          try {
            if (await this.runPostTypeInhibitors(message, command)) return;
            const before = command.before(message.ctx);
            if (Util.isPromise(before)) await before;
            await this.runCommand(message, command, {});
          } catch (err) {
            this.emit("error", err, message, command);
          }
        })()
      );
    }

    await Promise.all(promises);
    return true;
  }

  async handleDirectCommand(
    message: Message,
    content: string,
    command: Command,
    ignore = false
  ): Promise<null | void | boolean> {
    let key;
    try {
      if (!ignore) {
        if (message.editedTimestamp && !command.editable) {
          return false;
        }
        if (await this.runPostTypeInhibitors(message, command)) {
          return false;
        }
      }

      const before = command.before!(message.ctx);
      if (Util.isPromise(before)) await before;

      const args = await command.parse(message, content);
      if (Flag.is(args, "cancel")) {
        this.emit(CommandStoreEvents.COMMAND_CANCELLED, message.ctx, command);
        return true;
      } else if (Flag.is(args, "retry")) {
        this.emit(
          CommandStoreEvents.COMMAND_BREAKOUT,
          message.ctx,
          command,
          args.message
        );
        return this.handle(args.message);
      } else if (Flag.is(args, "continue")) {
        const continueCommand = this.components.get(args.command);
        return this.handleDirectCommand(
          message,
          args.rest,
          continueCommand!,
          args.ignore
        );
      }

      if (!ignore) {
        if (command.lock) key = command.lock(message.ctx, args);
        if (Util.isPromise(key)) key = await key;
        if (key) {
          if (command.locker.has(key)) {
            key = null;
            this.emit(CommandStoreEvents.COMMAND_LOCKED, message.ctx, command);
            return true;
          }

          command.locker.add(key);
        }
      }

      return await this.runCommand(message, command, args);
    } catch (err) {
      this.emit("error", err, message, command);
      return null;
    } finally {
      if (key) command.locker.delete(key);
    }
  }

  async runCommand(
    message: Message,
    command: Command,
    args: Record<string, any>
  ) {
    if (this.handling.sendTyping) await message.channel.sendTyping();

    try {
      this.emit(CommandStoreEvents.COMMAND_STARTED, message, command);
      // @ts-ignore
      const ret = await command.run(message.ctx, args);
      this.emit(CommandStoreEvents.COMMAND_FINISHED, message, command, ret);
    } catch (e) {
      this.emit("commandError", message, command, e);
    } finally {
      const ignored = Util.array(
        Util.isFunction(this.handling.ignoreCooldown)
          ? await this.handling.ignoreCooldown.call(this, message, command)
          : this.handling.ignoreCooldown
      );

      if (command.cooldown > 0 && !ignored.includes(message.author.id)) {
        const cooldown = this.getCooldown(message, command);
        try {
          cooldown.drip();
        } catch (err) {
          this.client.emit(
            "cooldown",
            message,
            command,
            cooldown.remainingTime
          );
        }
      }
    }
  }

  public async parseCommand(message: Message) {
    let prefixes: string[] = Util.array(
      await Util.intoCallable(this.handling.prefix)(message.ctx)
    );
    const allowMention = await Util.intoCallable(this.handling.prefix)(
      message.ctx
    );

    if (allowMention) {
      const mentions = [
        `<@${this.client.user.id}>`,
        `<@!${this.client.user.id}>`,
      ];
      prefixes = [...mentions, ...prefixes];
    }

    prefixes.sort(Util.prefixCompare);
    return this.parseMultiplePrefixes(
      message,
      prefixes.map((p) => [p, null])
    );
  }

  // Parsing

  public parseMultiplePrefixes(
    message: Message,
    pairs: [string, Set<string> | null][]
  ): ContextData {
    const parses = pairs.map(([prefix, cmds]) =>
      this.parseWithPrefix(message, prefix, cmds)
    );
    const result = parses.find((parsed) => parsed.command);

    if (result) return result;

    const guess = parses.find((parsed) => parsed.prefix != null);
    if (guess) return guess;

    return {};
  }

  public parseWithPrefix(
    message: Message,
    prefix: string,
    associatedCommands: Set<string> | null = null
  ): ContextData {
    const lowerContent = message.content.toLowerCase();
    if (!lowerContent.startsWith(prefix.toLowerCase())) {
      return {};
    }

    const endOfPrefix =
      lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
    const startOfArgs =
      message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
    const alias = message.content.slice(startOfArgs).split(/\s+|\n+/)[0];
    const command = this.findCommand(alias);
    const content = message.content
      .slice(startOfArgs + alias.length + 1)
      .trim();
    const afterPrefix = message.content.slice(prefix.length).trim();

    if (!command) return { prefix, alias, content, afterPrefix };

    if (associatedCommands == null) {
      if (command.prefix != null) {
        return { prefix, alias, content, afterPrefix };
      }
    } else if (!associatedCommands.has(command.name)) {
      return { prefix, alias, content, afterPrefix };
    }

    return { command, prefix, alias, content, afterPrefix };
  }

  public async parseCommandOverwrittenPrefixes(
    message: Message
  ): Promise<ContextData> {
    if (!this.prefixes.size) {
      return {};
    }

    const promises = this.prefixes.map(async (cmds, provider) => {
      const prefixes = Util.array(
        await Util.intoCallable(provider)(message.ctx)
      );
      return prefixes.map((p) => [p, cmds]);
    });

    const pairs = Util.flatMap(await Promise.all(promises), (x: any) => x);
    pairs.sort(([a], [b]) => Util.prefixCompare(a, b));
    return this.parseMultiplePrefixes(message, pairs);
  }

  /**
   * Runs all "all" type inhibitors.
   * @param message The message to pass.
   * @since 1.0.0
   */
  public async runAllTypeInhibitors(message: Message): Promise<boolean> {
    const reason = this.inhibitors
      ? await this.inhibitors.test("all", message)
      : null;

    if (reason != null)
      this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, reason);
    else if (
      this.handling.allowSelf &&
      message.author.id === this.client.user.id
    ) {
      console.log("self");
      this.emit(
        CommandStoreEvents.MESSAGE_INHIBITED,
        message,
        PreDefinedReason.SELF
      );
    } else if (!this.handling.allowBots && message.author.bot) {
      this.emit(
        CommandStoreEvents.MESSAGE_INHIBITED,
        message,
        PreDefinedReason.BOT
      );
    } else if (this.hasPrompt(message.channel, message.author))
      this.emit(CommandStoreEvents.IN_PROMPT, message);
    else return false;

    return true;
  }

  // Inhibitors

  /**
   * Runs all "pre" type inhibitors
   * @param message The message to pass.
   * @since 1.0.0
   */
  public async runPreTypeInhibitors(message: Message): Promise<boolean> {
    const reason = this.inhibitors
      ? await this.inhibitors.test("pre", message)
      : null;

    if (reason != null)
      this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, reason);
    else return false;

    return true;
  }

  /**
   * Runs all "post" type inhibitors.
   * @param message The message to pass.
   * @param command The command to pass.
   * @since 1.0.0
   */
  public async runPostTypeInhibitors(
    message: Message,
    command: Command
  ): Promise<boolean> {
    if (command.restrictions.includes("owner")) {
      const isOwner = this.client.isOwner(message.author);
      if (!isOwner) {
        this.emit(
          CommandStoreEvents.COMMAND_INHIBITED,
          message,
          command,
          PreDefinedReason.DEVELOPER
        );
        return true;
      }
    }

    if (command.channel.includes("text") && !message.member) {
      this.emit(
        CommandStoreEvents.COMMAND_INHIBITED,
        message,
        command,
        PreDefinedReason.GUILD
      );
      return true;
    }

    if (
      !command.channel.includes("dm") &&
      message.channel.type === Constants.ChannelTypes.DM
    ) {
      this.emit(
        CommandStoreEvents.COMMAND_INHIBITED,
        message,
        command,
        PreDefinedReason.DM
      );
      return true;
    }

    if (await this.runPermissionChecks(message, command)) return true;

    const reason = this.inhibitors
      ? await this.inhibitors.test("post", message, command)
      : null;

    if (reason != null) {
      this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, reason);
      return true;
    }

    return false;
  }

  public async runAllCommandInhibitors(
    message: Message,
    command: Command
  ): Promise<boolean> {
    const reason = this.inhibitors
      ? await this.inhibitors.test("command", message, command)
      : null;

    if (reason != null)
      this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, reason);
    else return false;

    return true;
  }

  /**
   * Runs permissions checks.
   * @param message The message to pass.
   * @param command THe command to pass.
   */
  public async runPermissionChecks(
    message: Message,
    command: Command
  ): Promise<boolean> {
    if (command.permissions) {
      if (Util.isFunction(command.permissions)) {
        let missing = command.permissions(message);
        if (Util.isPromise(missing)) missing = await missing;

        if (missing != null) {
          this.emit(
            CommandStoreEvents.MISSING_PERMISSIONS,
            message,
            command,
            "client",
            missing
          );
          return true;
        }
      } else if (message.member) {
        const me = message.member.guild.members.get(this.client.user.id)!;
        if (
          !Permissions.overlaps(
            me.permission.allow,
            command.permissionsBytecode
          )
        ) {
          const _ = command.permissionsBytecode & ~me.permission.allow;
          this.emit(
            CommandStoreEvents.MISSING_PERMISSIONS,
            message,
            command,
            "client",
            _
          );
          return true;
        }
      }
    }

    if (command.userPermissions) {
      const ignorer = this.handling.ignorePermissions;

      const isIgnored = Array.isArray(ignorer)
        ? ignorer.includes(message.author.id)
        : typeof ignorer === "function"
        ? ignorer(message, command)
        : message.author.id === ignorer;

      if (!isIgnored) {
        if (Util.isFunction(command.userPermissions)) {
          let missing = command.userPermissions(message);
          if (Util.isPromise(missing)) missing = await missing;

          if (missing != null) {
            this.emit(
              CommandStoreEvents.MISSING_PERMISSIONS,
              message,
              command,
              "user",
              missing
            );
            return true;
          }
        } else if (message.member) {
          if (
            !Permissions.overlaps(
              message.member.permission.allow,
              command.userPermissionsBytecode
            )
          ) {
            const _ =
              command.userPermissionsBytecode &
              ~message.member.permission.allow;
            this.emit(
              CommandStoreEvents.MISSING_PERMISSIONS,
              message,
              command,
              "user",
              _
            );
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Add a prompt to the prompt storage.
   * @param channel The channel of the prompt.
   * @param user The user to add.
   */
  public addPrompt(channel: Channel, user: User): void {
    let users = this.promptStorage.get(channel.id);
    if (!users) this.promptStorage.set(channel.id, new Set());
    users = this.promptStorage.get(channel.id);
    users!.add(user.id);
  }

  /**
   * Removes a prompt
   * @param channel Prompt channel.
   * @param user Prompt user.
   */
  public removePrompt(channel: Channel, user: User): void {
    const users = this.promptStorage.get(channel.id);
    if (!users) return;
    users.delete(user.id);
    if (!users.size) this.promptStorage.delete(user.id);
  }

  /**
   * Check if a prompt exists.
   * @param channel The channel of the prompt.
   * @param user A user of the prompt.
   */
  public hasPrompt(channel: Channel, user: User): boolean {
    const users = this.promptStorage.get(channel.id);
    if (!users) return false;
    return users.has(user.id);
  }

  private getCooldown(message: Message, command: Command) {
    let cooldownManager = this.cooldowns.get(command);

    if (!cooldownManager) {
      cooldownManager = new RatelimitManager(command.bucket, command.cooldown);
      this.cooldowns.set(command, cooldownManager);
    }

    return cooldownManager.acquire(
      message.ctx.guild
        ? Reflect.get(message, command.cooldownType).id
        : message.author.id
    );
  }
}

export enum CommandStoreEvents {
  MESSAGE_INHIBITED = "messageInhibited",
  MESSAGE_INVALID = "messageInvalid",
  IN_PROMPT = "messageInPrompt",
  MISSING_PERMISSIONS = "missingPermissions",
  COMMAND_INHIBITED = "commandInhibited",
  COMMAND_BREAKOUT = "commandBreakout",
  COMMAND_LOCKED = "commandLocked",
  COMMAND_CANCELLED = "commandCancelled",
  COMMAND_STARTED = "commandStarted",
  COMMAND_FINISHED = "commandFinished",
}

export enum PreDefinedReason {
  SELF = "blockedSelf",
  BOT = "blockedBot",
  GUILD = "guild",
  DM = "dm",
  DEVELOPER = "developer",
}
