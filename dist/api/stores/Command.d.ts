import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";
import { Context, ContextData, InhibitorStore, ListenerStore, MonitorStore, Storage, TypeResolver } from "../..";
import type { BladeClient } from "../Client";
import type { Channel, Message, User } from "eris";
import { Command, DefaultArgumentOptions } from "../components/command/";
export declare type IgnorePermissions = (message: Message, command: Command) => boolean;
export declare type IgnoreCooldown = (message: Message, command: Command) => boolean;
export declare type PrefixProvider = (ctx: Context) => string | string[] | Promise<string | string[]>;
export interface HandlingOptions {
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
export declare class CommandStore extends ComponentStore<Command> {
    readonly types: TypeResolver;
    /**
     * The inhibitor store to use while handling messages.
     * @since 1.0.0
     */
    inhibitors?: InhibitorStore;
    /**
     * Settings to use while handling
     * @since 1.0.0
     */
    handling: HandlingOptions;
    /**
     * The default command cooldown.
     * @since 1.0.0
     * @default 5 seconds
     */
    defaultCooldown: number;
    /**
     * An alias storage.
     * @since 1.0.0
     */
    aliases: Storage<string, string>;
    /**
     * A prefix storage.
     */
    prefixes: Storage<string | PrefixProvider, Set<string>>;
    /**
     * A map of cooldowns.
     * @since 1.0.0
     */
    private readonly cooldowns;
    /**
     * A storage for prompts.
     * @since 1.0.0
     * @readonly
     */
    private readonly promptStorage;
    /**
     * A storage for contexts.
     * @since 1.0.0
     * @readonly
     */
    private readonly contextStorage;
    /**
     * Creates a new Command Store
     * @param client The client that is using this command store.
     * @param options The options to give.
     */
    constructor(client: BladeClient, options?: CommandStoreOptions);
    /**
     * A wrapper for the super.add method
     * @param component
     * @since 1.0.0
     */
    add(component: Command): Command | null;
    /**
     * A wrapper for the super.remove method.
     * @param resolvable
     * @since 1.0.0
     */
    remove(resolvable: ComponentResolvable<Command>): Command | null;
    useInhibitorStore(inhibitorStore: InhibitorStore): this;
    useMonitorStore(inhibitorStore: MonitorStore): this;
    useListenersStore(listenerStore: ListenerStore): this;
    /**
     * Finds a command
     * @param id
     */
    findCommand(id: string): Command | undefined;
    /**
     * Handles a sent message.
     * @param message The received message.
     * @since 1.0.0
     */
    handle(message: Message): Promise<boolean>;
    handleRegexAndConditionalCommands(message: Message): Promise<boolean>;
    handleRegexCommands(message: Message): Promise<boolean>;
    handleConditionalCommands(message: Message): Promise<boolean>;
    handleDirectCommand(message: Message, content: string, command: Command, ignore?: boolean): Promise<null | void | boolean>;
    runCommand(message: Message, command: Command, args: Record<string, any>): Promise<void>;
    parseCommand(message: Message): Promise<ContextData>;
    parseMultiplePrefixes(message: Message, pairs: [string, Set<string> | null][]): ContextData;
    parseWithPrefix(message: Message, prefix: string, associatedCommands?: Set<string> | null): ContextData;
    parseCommandOverwrittenPrefixes(message: Message): Promise<ContextData>;
    /**
     * Runs all "all" type inhibitors.
     * @param message The message to pass.
     * @since 1.0.0
     */
    runAllTypeInhibitors(message: Message): Promise<boolean>;
    /**
     * Runs all "pre" type inhibitors
     * @param message The message to pass.
     * @since 1.0.0
     */
    runPreTypeInhibitors(message: Message): Promise<boolean>;
    /**
     * Runs all "post" type inhibitors.
     * @param message The message to pass.
     * @param command The command to pass.
     * @since 1.0.0
     */
    runPostTypeInhibitors(message: Message, command: Command): Promise<boolean>;
    runAllCommandInhibitors(message: Message, command: Command): Promise<boolean>;
    /**
     * Runs permissions checks.
     * @param message The message to pass.
     * @param command THe command to pass.
     */
    runPermissionChecks(message: Message, command: Command): Promise<boolean>;
    /**
     * Add a prompt to the prompt storage.
     * @param channel The channel of the prompt.
     * @param user The user to add.
     */
    addPrompt(channel: Channel, user: User): void;
    /**
     * Removes a prompt
     * @param channel Prompt channel.
     * @param user Prompt user.
     */
    removePrompt(channel: Channel, user: User): void;
    /**
     * Check if a prompt exists.
     * @param channel The channel of the prompt.
     * @param user A user of the prompt.
     */
    hasPrompt(channel: Channel, user: User): boolean;
    private getCooldown;
}
export declare enum CommandStoreEvents {
    MESSAGE_INHIBITED = "messageInhibited",
    MESSAGE_INVALID = "messageInvalid",
    IN_PROMPT = "messageInPrompt",
    MISSING_PERMISSIONS = "missingPermissions",
    COMMAND_INHIBITED = "commandInhibited",
    COMMAND_BREAKOUT = "commandBreakout",
    COMMAND_LOCKED = "commandLocked",
    COMMAND_CANCELLED = "commandCancelled",
    COMMAND_STARTED = "commandStarted",
    COMMAND_FINISHED = "commandFinished"
}
export declare enum PreDefinedReason {
    SELF = "blockedSelf",
    BOT = "blockedBot",
    GUILD = "guild",
    DM = "dm",
    DEVELOPER = "developer"
}
