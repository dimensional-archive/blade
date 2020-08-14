import type {
  Client,
  ClientOptions,
  Constructor,
  Embed,
  Extender,
  Guild,
  Member,
  Message,
  Permission,
  PermissionResolvable,
  ProxyStore,
  Store,
  Structure,
  TextBasedChannel,
  User
} from "@kyudiscord/neo";
import type { Logger } from "@melike2d/logger";
import type { EventEmitter } from "events";
import type { Stats } from "fs";

declare global {
  type Tuple<A, B> = [ A, B ];

  interface String {
    capitalize(lowerRest?: boolean): this;
  }
}

declare module "@kyudiscord/neo" {
  interface Message {
    ctx: Context;
  }
}

export class Context {
  /**
   * The message.
   */
  readonly message: Message;
  /**
   * The client.
   */
  readonly client: BladeClient;
  /**
   * Parsed Parameters for this invocation
   */
  params: Params;
  /**
   * Parsed flags for this invocation.
   */
  flags: Flags;
  /**
   * The author of this message.
   */
  author: User;
  /**
   * The invoker.
   */
  member: Member | null;
  /**
   * The guild this message was sent in.
   */
  guild: Guild | null;
  /**
   * The channel this message sent in.
   */
  channel: TextBasedChannel;
  /**
   * Whether or not the last response should be edited.
   */
  shouldEdit: boolean;
  /**
   * The last response.
   */
  lastResponse?: Message;
  /**
   * All responses..
   */
  messages: Map<string, Message>;
  /**
   * Parsing index.
   */
  parseIndex: number;

  /**
   * @param dispatcher
   * @param message
   */
  constructor(dispatcher: CommandDispatcher, message: Message);

  /**
   * Replies to the message.
   * @param content
   */
  reply(content: string | Embed): Promise<Message>;

  /**
   * Edits the last response.
   * @param content Content to edit the message with.
   */
  edit(content: string | Embed): Promise<Message>;
}

export class Module extends Structure {
  readonly options: ModuleOptions;
  /**
   * The ID of this component.
   */
  id: string;
  /**
   * The logger for this component.
   */
  logger: Logger;
  /**
   * The handler that loaded this component.
   */
  handler: Handler<Module>;
  /**
   * Whether or not this component is enabled.
   */
  enabled: boolean;
  /**
   * The category of this command.
   */
  categoryId: string;
  /**
   * This components path.
   */
  path: string;
  /**
   * The location of this file.
   */
  protected _loc: Tuple<string, string[]>;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: ModuleOptions);

  /**
   * Ran when the client is ready.
   * @since 1.0.0
   */
  init(): unknown;

  /**
   * Disables this component.
   * @since 1.0.0
   */
  disable(): this;

  /**
   * Enables this component.
   * @since 1.0.0
   */
  enable(): this;

  /**
   * Reloads this module.
   * @since 1.0.0
   */
  reload(): Promise<Module>;

  /**
   * Unloads this module.
   * @since 1.0.0
   */
  unload(): Module;

  /**
   * @param handler
   * @param dir
   * @param file
   */
  protected _patch(handler: Handler<Module>, dir: string, file: string[]): this;
}

export type ModuleResolvable<T extends Module = Module> = string | T;

export interface ModuleOptions {
  id?: string;
  enabled?: boolean;
  category?: string;
}

export class Handler<T extends Module> extends EventEmitter {
  /**
   * The client instance.
   */
  readonly client: BladeClient;
  /**
   * The component store.
   */
  readonly store: Store<string, T>;
  /**
   * The name of this handler.
   */
  readonly name: string;
  /**
   * The directory this handler loads.
   */
  directory: string;
  /**
   * The filter to use when loading files..
   */
  loadFilter: LoadFilter;
  /**
   * The typeof class this handler is supposed to load.
   */
  class: Constructor<T>;

  /**
   * @param client
   * @param name
   * @param options
   */
  constructor(client: BladeClient, name: string, options: HandlerOptions);

  /**
   * Walks a directory.
   * @param dir The directory to walk.
   */
  static walk(dir: string): Tuple<string, string[]>[];

  /**
   * Loads a file.
   * @since 1.0.0
   */
  load(dir: string, file: string[], reload?: boolean): Promise<T | null>;

  /**
   * Loads all files in a directory.
   * @param directory The directory to load from.
   * @since 1.0.0
   */
  loadAll(directory?: string): Promise<number>;

  /**
   * Resolves a string or module into a module.
   * @param resolvable
   * @since 1.0.0
   */
  get(resolvable: ModuleResolvable<T>): T | undefined;

  /**
   * Adds a new module to this handler.
   * @param module The module to add.
   * @param reload Whether or not the module was reloaded.
   * @since 1.0.0
   */
  add(module: T, reload?: boolean): T | null;

  remove(resolvable: ModuleResolvable<T>, emit?: boolean): T | null;

  /**
   * Emits an event to all handlers.
   * @param event The event to emit.
   * @param args The arguments to pass.
   * @since 1.0.0
   */
  emit(event: string, ...args: unknown[]): boolean;
}

export type LoadFilter = (path: string, stats: Stats) => boolean;

export interface HandlerOptions {
  directory?: string;
  loadFilter?: LoadFilter;
  class?: Constructor<Module>;
}

export class Flags {
  /**
   * Set the raw parameter data.
   * @param data
   */
  set data(data: Dictionary<unknown>);

  /**
   * Get a flag.
   * @param flag The flag to get.
   * @since 1.0.0
   */
  get<T>(flag: string): T;

  /**
   * Whether or not a flag exists.
   * @param flag The flag to check
   * @since 1.0.0
   */
  has(flag: string): boolean;
}

export class Params {
  /**
   * Set the raw parameter data.
   * @param data
   */
  set data(data: Dictionary<unknown>);

  /**
   * Get an argument.
   * @param parameter
   */
  get<T>(parameter: string): T;

  /**
   * Set a parameters value.
   * @param parameter
   * @param value
   */
  set(parameter: string, value: unknown): Params;
}

export class Command extends Module {
  readonly options: CommandOptions;
  /**
   * Ratelimits for this command
   */
  readonly ratelimits: Store<string, Ratelimit>;
  /**
   * The environments this command can be ran in.
   */
  runIn?: RunIn;
  /**
   * Triggers for this command.
   */
  triggers: string[];
  /**
   * Permissions the client needs for this command to be ran.
   */
  clientPerms: PermissionResolvable[] | Permissions;
  /**
   * Permissions the invoker needs to run the command.
   */
  memberPerms: PermissionResolvable[] | Permissions;
  /**
   * This command's usage.
   */
  usage: string;
  /**
   * The description of this command.
   */
  description: string;
  /**
   * Example usages of this command.
   */
  examples: string[];
  /**
   * Extended description content.
   */
  extendedDescription?: string;
  /**
   * Whether or not this command can only be ran by developers/
   */
  developerOnly: boolean;
  /**
   * IDs that will bypass permission checks.
   */
  ignorePermissions: string[] | IgnorePermissions;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: CommandOptions);

  /**
   * The ratelimit options for this command.
   */
  get ratelimit(): CommandRatelimit;

  /**
   * Called whenever a message matches any of the provided triggers.
   * @param ctx The command context.
   * @since 1.0.0
   */
  run(ctx: Context): Promise<unknown>;
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

export {};

export class CommandDispatcher {
  readonly options: DispatcherOptions;
  /**
   * The command handler.
   */
  readonly handler: CommandHandler;
  /**
   * The client instance.
   */
  readonly client: BladeClient;
  /**
   * All contexts.
   */
  readonly contexts: Store<string, Context>;

  /**
   * @param handler
   * @param options
   */
  constructor(handler: CommandHandler, options?: DispatcherOptions);

  /**
   * A regexp for testing if the prefix is the client mention.
   */
  get mentionRegexp(): RegExp;

  /**
   * A regexp for testing whether or not message content only includes a mention.
   */
  get aloneRegexp(): RegExp;

  /**
   * Handles an incoming message.
   * @param message
   */
  handle(message: Message): Promise<unknown>;
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

export class CommandHandler extends Handler<Command> {
  /**
   * The command dispatcher.
   */
  readonly dispatcher: CommandDispatcher;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: CommandHandlerOptions);
}

export interface CommandHandlerOptions extends HandlerOptions {
  dispatcher?: DispatcherOptions;
}

export class Listener extends Module {
  readonly options: ListenerOptions;

  /**
   * The listeners handler.
   */
  handler: ListenerHandler;

  /**
   * The events this listener is for.
   */
  event: string[];

  /**
   * Whether or not this listener is ran once.
   */
  once: boolean;

  /**
   * The method map.
   */
  map: Dictionary<string>;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options: ListenerOptions);

  /**
   * The emitter to listen on.
   */
  get emitter(): EventEmitter;

  /**
   * Called whenever
   */
  run(): void;

  /**
   * @private
   */
  _listen(): this;

  /**
   * @private
   */
  _unListen(): Listener;
}

export interface ListenerOptions extends ModuleOptions {
  event: string | string[];
  emitter?: string | EventEmitter;
  once?: boolean;
  map?: Dictionary<string>;
}

export {};

export class ListenerHandler extends Handler<Listener> {
  /**
   * Emitters to use for listeners.
   */
  emitters: Dictionary<EventEmitter>;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options: ListenerHandlerOptions);

  /**
   * Adds a new listener to this handler.
   * @param module The listener to add.
   * @param reload Whether or not the listener was reloaded.
   * @since 1.0.0
   */
  add(module: Listener, reload?: boolean): Listener | null;

  /**
   * Removes a listener from this handler.
   * @param resolvable The listener to remove.
   * @since 1.0.0
   */
  remove(resolvable: ModuleResolvable<Listener>): Listener | null;
}

export interface ListenerHandlerOptions {
  emitters?: Dictionary<EventEmitter>;
}

export {};

export class Monitor extends Module {
  /**
   * Called whenever a message is received.
   * @param _message
   * @since 1.0.0
   */
  run(_message: Message): unknown;

  /**
   * @private
   */
  _run(message: Message): Promise<void>;
}

export class MonitorHandler extends Handler<Monitor> {
  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options: HandlerOptions);
}

export {};

/**
 * A helper decorator for applying options to a command.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function command(options: CommandOptions): <T extends new (...args: any[]) => Command>(target: T) => T;

/**
 * A helper decorator for applying options to a listener.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function listener(options: ListenerOptions): <T extends new (...args: any[]) => Listener>(target: T) => T;

/**
 * A helper decorator for applying options to a monitor.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function monitor(options?: ModuleOptions): <T extends new (...args: any[]) => Monitor>(target: T) => T;

export type Decorator<M> = (target: Constructor<M>) => Constructor<M>;

export const blade: Extender<unknown, {
  Context: typeof Context;
  CommandDispatcher: typeof CommandDispatcher;
  Module: typeof Module;
  Handler: typeof Handler;
}>;

/**
 * @file modified https://github.com/Naval-Base/ms
 */
export enum Unit {
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
  WEEK = 604800000,
  YEAR = 31557600000
}

export class Duration {
  /**
   * Parses a number into a string.
   * @param val The number to parse.
   * @param long Whether or not to return the long version.
   * @since 1.0.0
   */
  static parse(val: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param val The string to parse.
   * @since 1.0.0
   */
  static parse(val: string): number;
}

/**
 * A helper function to test if a path leads to a directory.
 * @param path
 */
export function isDir(path: string): boolean;

/**
 * A helper function for recursively reading a directory.
 * @param path
 */
export function readDir(path: string): string[];

/**
 * A helper function for determining whether something is a class.
 * @param input
 * @since 2.0.0
 */
export function isClass(input: unknown): input is Constructor<unknown>;

/**
 * A helper function for capitalizing the first letter in the sentence.
 * @param str
 * @param lowerRest
 * @since 2.0.0
 */
export function capitalize(str: string, lowerRest?: boolean): string;

/**
 * A helper function for determining if a value is an event emitter.
 * @param input
 * @since 2.0.0
 */
export function isEmitter(input: any): input is EventEmitter;

/**
 * Returns an array.
 * @param v
 * @since 2.0.0
 */
export function array<T>(v: T | T[]): T[];

/**
 * A helper function for determining if a value is a string.
 * @param value
 * @since 2.0.0
 */
export function isString(value: unknown): value is string;

export function isPromise(value: any): value is Promise<unknown>;

// eslint-disable-next-line @typescript-eslint/ban-types
export function intoCallable(value: unknown): value is Function;

/**
 * Code block template tag.
 * @param strings
 * @param values
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]): string;
/**
 * Creates a typed code block template tag.
 * @param type The type of code block.
 */
export function code(type: string): TemplateTag;

export type TemplateTag = (strings: TemplateStringsArray, ...values: unknown[]) => string;

/**
 * @file A simple git information utility class.
 */
export abstract class ProjectInfo {
  static dir: string;

  /**
   * Whether the project root is a git project.
   */
  static get isGitProject(): boolean;

  /**
   * The current version of this project. (package.json)
   */
  static get version(): string | null;

  /**
   * The current branch.
   * @since 2.0.0
   */
  static currentBranch(): Promise<string> | null;

  /**
   * All of the branches in the git project.
   * @since 2.0.0
   */
  static allBranches(): Promise<string[]> | null;

  /**
   * Get the current commit hash of the project.
   * @param shorten
   * @since 2.0.0
   */
  static currentHash(shorten?: boolean): Promise<string> | null;

  /**
   * Get all commits.
   * @param limit
   * @since 2.0.0
   */
  static getCommits(limit?: number): Promise<GitCommit[]> | null;

  /**
   * Provide a different url than the project root.
   * @param dir
   * @since 2.0.0
   */
  static useDirectory(dir: string): typeof ProjectInfo;
}

export interface GitCommit {
  committer: string;
  hash: string;
  subject: string;
}

export class Category<T extends Module> extends ProxyStore<string, T> {
  /**
   * The ID of this category.
   */
  readonly id: string;

  /**
   * @param handler
   * @param id
   * @param commands
   */
  constructor(handler: Handler<T>, id: string, commands?: string[]);
}

/**
 * Creates a new logger with a provided name.
 * @param name The logger name.
 * @since 1.0.0
 */
export function logger(name: string | any): PropertyDecorator;
/**
 * Creates a new logger with a random name.
 * @since 1.0.0
 */
export function logger(target: any, propertyKey: PropertyKey): void;

export class BladeClient extends Client {
  /**
   * The logger for this client instance.
   */
  readonly logger: Logger;
  /**
   * The options given to this client.
   */
  options: BladeOptions;

  /**
   * @param options
   */
  constructor(options: BladeOptions);

  /**
   * The user directory for loading components.
   */
  get userDirectory(): string;
}

export interface BladeOptions extends ClientOptions {
  token: string;
  directory?: string;
}

