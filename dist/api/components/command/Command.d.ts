import { Component, ComponentOptions } from "../Base";
import { CommandStore, IgnoreCooldown, IgnorePermissions, PrefixProvider } from "../../..";
import { Context } from "./Context";
import type { Permission } from "eris";
import { Message } from "eris";
import type { ArgumentOptions, DefaultArgumentOptions } from "./argument/Types";
import { ArgumentGenerator } from "./argument/ArgumentRunner";
export declare type CooldownType = "author" | "channel";
export declare type Restrictions = "owner" | "guildOwner";
export declare type AllowedChannels = "text" | "dm";
export declare type RegexProvider = (ctx: Context) => RegExp | Promise<RegExp>;
export declare type Before = (ctx: Context) => boolean | Promise<boolean>;
export declare type KeySupplier = (ctx: Context, args?: any) => string;
export declare type ExecutionPredicate = (ctx: Context) => boolean;
export interface CommandDescription {
    /**
     * The description content.
     */
    content?: string;
    /**
     * Extended help for this command.
     */
    extendedContent?: string;
    /**
     * How to use this command.
     */
    usage?: string;
    /**
     * Examples of this command.
     */
    examples?: string[];
}
export interface CommandOptions extends ComponentOptions {
    /**
     * Command aliases to use.
     */
    aliases?: string[];
    /**
     * Description of the command.
     */
    description?: CommandDescription;
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
    flags?: string[];
    optionFlags?: string[];
    quoted?: boolean;
    separator?: string;
    lock?: "guild" | "channel" | "user" | KeySupplier;
    condition?: ExecutionPredicate;
}
/**
 * The base command class.
 * @since 1.0.0
 */
export declare class Command extends Component {
    #private;
    /**
     * The command store.
     * @since 1.0.0
     */
    readonly store: CommandStore;
    readonly locker: Set<KeySupplier>;
    /**
     * The aliases for this command.
     */
    aliases: string[];
    /**
     * This commands description.
     * @since 1.0.0
     */
    description: CommandDescription;
    /**
     * Restrictions for this command.
     * @since 1.0.0
     */
    restrictions: Restrictions[];
    /**
     * The channel types allowed to run this command.
     * @since 1.0.0
     */
    channel: AllowedChannels[];
    /**
     * Permissions the invoker needs to run this command.
     * @since 1.0.0
     */
    userPermissions: Permission[];
    /**
     * Permissions the bot needs before running this command.
     * @since 1.0.0
     */
    permissions: Permission[];
    /**
     * Per-command inhibitors to run.
     * @since 1.0.0
     */
    inhibitors: string[];
    /**
     * Whether this command can be edited or not.
     * @since 1.0.0
     */
    editable: boolean;
    /**
     * The amount of times the command can be ran before being ratelimited.
     * @since 1.0.0
     */
    bucket: number;
    /**
     * The cooldown for this command.
     * @since 1.0.0
     */
    cooldown: number;
    /**
     * The cooldown type for this command.
     * @since 1.0.0
     */
    cooldownType: CooldownType;
    /**
     * Whether this command his hidden or not.
     * @since 1.0.0
     */
    hidden: boolean;
    /**
     * Whether this command is guarded or not.
     * @since 1.0.0
     */
    guarded: boolean;
    /**
     * Specific prefixes for this command.
     * @since 1.0.0
     */
    prefix: string[] | PrefixProvider | null;
    /**
     * Default argument options for this command.
     * @since 1.0.0
     */
    argumentDefaults: DefaultArgumentOptions;
    /**
     * A method that gets called right before the command gets ran.
     * @since 1.0.0
     */
    before: Before;
    /**
     * A condition method that gets called before this command runs.
     * @since 1.0.0
     */
    condition: ExecutionPredicate;
    /**
     * Use a regexp as an invoke
     * @since 1.0.0
     */
    regex: RegExp | RegexProvider | null;
    lock: KeySupplier | null;
    /**
     * Creates a new Command.
     * @param store The command store.
     * @param dir The directory that holds this command/
     * @param file The path to this command.
     * @param options Options to use.
     */
    constructor(store: CommandStore, dir: string, file: string[], options?: CommandOptions);
    /**
     * Returns the bytecode of the required user permissions.
     * @since 1.0.0
     */
    get userPermissionsBytecode(): number;
    /**
     * Returns the bytecode of the required client permissions.
     * @since 1.0.0
     */
    get permissionsBytecode(): number;
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this command.
     * @constructor
     */
    static Setup(options?: CommandOptions): <T extends new (...args: any[]) => Component>(t: T) => T;
    /**
     * Executes this command.
     * @param ctx The message context for this execution.
     * @param args The parsed arguments.
     */
    run(ctx: Context, args?: Record<string, any>): any | Promise<any>;
    /**
     * Parses the arguments of this command.
     * @param message
     * @param content
     */
    parse(message: Message, content: string): Promise<any>;
}
