import type {
  Client,
  ClientOptions,
  Constructor,
  Embed,
  Extender,
  Fn,
  Guild,
  Member,
  Message,
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
import type { MessageType } from "@kyudiscord/dapi";

declare global {
  type Tuple<A, B> = [ A, B ];

  interface String {
    capitalize(lowerRest?: boolean): this;
  }
}
declare module "@kyudiscord/neo" {
  interface Message {
    ctx?: Context;
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
   * The command dispatcher.
   */
  readonly dispatcher: CommandDispatcher;
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

  /**
   * Resolve a string into a specific type.
   * @param value The value to resolve
   * @param type The type.
   * @since 1.0.3
   */
  resolve<T = unknown>(value: string, type: ParamType): Promise<T | null>;
}

export class Module<O extends ModuleOptions = ModuleOptions> extends Structure {
  /**
   * The options that were provided.
   */
  readonly options: O;
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
  constructor(client: BladeClient, options?: Partial<O>);

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
   * Set a flag value.
   * @param flag The flag to set.
   * @param value The flag value.
   * @since 1.0.0
   */
  set(flag: string, value: unknown): Flags;

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

export class ContentParser {
  /**
   * Flag keys.
   */
  flagKeys: string[];
  /**
   * Option flag keys.
   */
  optionKeys: string[];
  /**
   * Whether or not the content is quoted/has quotes.
   */
  quoted: boolean;
  /**
   * The argument separator.
   */
  separator: string;

  /**
   * @param flagKeys
   * @param optionKeys
   * @param quoted
   * @param separator
   */
  constructor({ flagKeys, optionKeys, quoted, separator }?: ContentParserOptions);

  /**
   * Get all flags from command parameters.
   * @param parameters The command parameters.
   * @since 1.0.3
   */
  static getFlags(parameters: Dictionary<ParameterOptions>): Promise<FlagResults>;

  /**
   * Parses a string.
   * @param content The content to parse.
   * @since 1.0.3
   */
  parse(content: string): ContentParserResult;
}

export interface ContentParserOptions {
  flagKeys?: string[];
  optionKeys?: string[];
  quoted?: boolean;
  separator?: string;
}

export interface StringData {
  type: "Phrase" | "Flag" | "OptionFlag";
  raw: string;
  key?: string;
  value?: string;
}

export interface ContentParserResult {
  all: StringData[];
  phrases: StringData[];
  flags: StringData[];
  options: StringData[];
}

export interface FlagResults {
  optionKeys: string[];
  flagKeys: string[];
}

export class Parser {
  tokens: Token[];
  /**
   * Whether or not ***separated***
   */
  separated: boolean;
  /**
   * The position.
   */
  position: number;
  /**
   * The parser results.
   */
  results: ParserResults;

  /**
   * @param tokens
   * @param separated
   */
  constructor(tokens: Token[], separated?: boolean);

  /**
   * Parses the tokens.
   */
  parse(): ParserResults;
}

export interface ParserResults {
  all: any[];
  phrases: any[];
  flags: any[];
  options: any[];
}

export class Tokenizer {
  /**
   * Flag words.
   */
  readonly flagWords: string[];
  /**
   * Option flag words
   */
  readonly optionFlags: string[];
  /**
   * Whether or not the content is quoted/has quotes.
   */
  readonly quoted: boolean;
  /**
   * The separator.
   */
  readonly separator: string;
  /**
   * The provided content.
   */
  readonly content: string;

  constructor(content: string, { flagWords, optionFlagWords, quoted, separator, }?: TokenizerData);

  /**
   * @param str
   */
  startsWith(str: string): boolean;

  /**
   * @param regex
   */
  match(regex: RegExp): RegExpMatchArray | null;

  /**
   * @param from
   * @param to
   */
  slice(from: number, to: number): string;

  /**
   * @param type
   * @param value
   */
  addToken(type: TokenType, value: string): void;

  /**
   * Advances the tokenizer position.
   * @param n
   */
  advance(n: number): void;

  /**
   * @param actions
   */
  choice(...actions: Fn[]): void;

  /**
   * Tokenize's content.
   */
  tokenize(): Token[];

  /**
   * Runs once.
   */
  runOne(): void;

  /**
   * Runs a flag.
   */
  runFlags(): boolean;

  /**
   * Runs an option flags.
   */
  runOptionFlags(): boolean;

  /**
   * Runs a quote.
   */
  runQuote(): boolean;

  /**
   * Runs an open quote.
   */
  runOpenQuote(): boolean;

  /**
   * Runs an end quote.
   */
  runEndQuote(): boolean;

  /**
   * Runs the separator.
   */
  runSeparator(): boolean;

  runWord(): boolean;

  /**
   * Runs whitespace
   */
  runWhitespace(): boolean;
}

export type TokenType =
  "WS"
  | "Word"
  | "Separator"
  | "OpenQuote"
  | "EndQuote"
  | "FlagWord"
  | "Quote"
  | "OptionFlagWord"
  | "EOF";
export type Token = {
  type: TokenType;
  value: string;
};

export interface TokenizerData {
  flagWords: string[];
  optionFlagWords: string[];
  quoted: boolean;
  separator: string;
}

export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  FLAG = "flag",
  MEMBER = "member",
  USER = "user",
  GUILD = "guild",
  VOICE_CHANNEL = "voiceChannel",
  TEXT_CHANNEL = "textChannel",
  ROLE = "role",
  EMOJI = "emoji",
  URL = "url",
  INTEGER = "integer",
  EMOJI_INT = "emojiInt",
  DATE = "date",
  COLOR = "color",
  BIGINT = "bigint"
}

export class TypeResolver {
  static BUILT_IN: Record<string, Resolver>;
  /**
   * The client instance.
   */
  readonly client: BladeClient;
  /**
   * Types to use.
   */
  readonly types: Store<string, Resolver>;

  /**
   * @param client
   */
  constructor(client: BladeClient);

  /**
   * Add all built-in type resolvers.
   */
  addBuiltIns(): this;

  /**
   * Get a type resolver.
   * @param type
   * @since 1.0.0
   */
  type(type: ParamType): Resolver | undefined;
}

export type Resolver = (phrase: string, ctx: Context) => Promise<unknown> | unknown;

export enum ActionKey {
  DECLARE_FLAG = 0,
  MAKE_GREEDY = 1,
  DECLARE_TYPE = 2,
  VALIDATE = 3,
  DECLARE_MATCH = 4
}

export class TypeBuilder {
  /**
   * Actions the user wants done or smth idrfk.
   * Sorts the actions: flag? -> greedy? -> type | regex | custom -> validations?
   */
  getActions(): ParsedActions;

  /**
   * Declare the type of this parameter..
   * @param type
   */
  resolve(type: ParamType): TypeBuilder;

  /**
   * Consumes the rest of the content.
   */
  rest(): TypeBuilder;

  /**
   * Declares a custom type for this parameter.
   * @param type
   */
  custom(type: TypeCast): TypeBuilder;

  /**
   * Uses a regular expression as the parameter type.
   * @param regex
   */
  match(regex: RegExp): TypeBuilder;

  /**
   * Validate the parameter.
   * @param validation
   */
  validate<T>(validation: Validation<T>): TypeBuilder;

  /**
   * Validates the range of a number parameter.
   * @param from
   * @param to
   * @param orEqualTo
   */
  range(from: number, to: number, orEqualTo?: boolean): TypeBuilder;

  /**
   * Turns this parameter into a flag.
   * @param settings The settings to use when parsing this parameter.
   */
  flag(settings?: FlagSettings): TypeBuilder;

  /**
   * Makes this parameter greedy.
   */
  greedy(settings?: GreedySettings): TypeBuilder;

  /**
   * Whether or not the value is of something.
   * @param type
   */
  of(type: Array<string | string[]>): TypeBuilder;
}

export type Validation<T = unknown> = (v: T, ctx: Context) => boolean;
export type TypeCast = (phrase: string, ctx: Context) => unknown;
export type ParameterType = RegExp | ParamType | TypeCast;

export interface BuilderAction<V = any> {
  key: ActionKey;
  value: V;
}

export interface FlagSettings {
  aliases?: string[];
  option?: boolean;
}

export interface GreedySettings {
  min?: number;
  max?: number;
}

export interface ParsedActions {
  flag?: FlagSettings;
  greedy?: GreedySettings;
  validations: Validation[];
  type: ParameterType;
  match?: "rest";
}

export const RATELIMIT_REGEXP: RegExp;
export const ratelimitDefaults: CommandRatelimit;

export class Command extends Module<CommandOptions> {
  readonly options: CommandOptions;
  /**
   * Ratelimits for this command
   */
  readonly ratelimits: Store<string, Ratelimit>;
  /**
   * The commands handler.
   */
  handler: CommandHandler;
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
   * Parameters given to this command.
   */
  params: Dictionary<ParameterOptions> | boolean;
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
   * The command dispatcher.
   */
  get dispatcher(): CommandDispatcher;

  /**
   * The ratelimit options for this command.
   */
  get ratelimit(): CommandRatelimit;

  /**
   * Called whenever a message matches any of the provided triggers.
   * @param ctx The command context.
   * @param args
   * @since 1.0.0
   */
  run(ctx: Context, args: Array<string | unknown>): unknown;
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
  description?: string;
  /**
   * Example usages of this command.
   */
  examples?: string[];
  /**
   * Extended help for this command.
   */
  extendedDescription?: string;
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
   * The type resolver.
   */
  readonly resolver: TypeResolver;
  /**
   * The inhibitor handler.
   */
  inhibitorHandler?: InhibitorHandler;

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
   * Use an inhibitor handler when dispatching commands.
   * @param inhibitorHandler The handler to use.
   * @since 1.0.3
   */
  useInhibitors(inhibitorHandler: InhibitorHandler): this;

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
  inhibitorHandler?: InhibitorHandler;
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

export class Listener extends Module<ListenerOptions> {
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
  get emitter(): EventEmitterLike;

  /**
   * Called whenever
   */
  run(...args: unknown[]): void;

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
  emitter?: string | EventEmitterLike;
  once?: boolean;
  map?: Dictionary<string>;
}

export class ListenerHandler extends Handler<Listener> {
  /**
   * Emitters to use for listeners.
   */
  emitters: Dictionary<EventEmitterLike>;

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

export interface ListenerHandlerOptions extends HandlerOptions {
  emitters?: Dictionary<EventEmitter>;
}

export class Monitor extends Module<MonitorOptions> {
  /**
   * Different things to ignore.
   */
  ignore: MonitorIgnore;
  /**
   * The allowed types of message.
   */
  allowedTypes: MessageType[];

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: MonitorOptions);

  /**
   * Called whenever a message is received.
   * @param message
   * @since 1.0.0
   */
  run(message: Message): unknown;

  /**
   * @private
   */
  _run(message: Message): Promise<void>;
}

export interface MonitorOptions extends ModuleOptions {
  /**
   * Types of messages
   */
  allowedTypes?: MessageType[];
  /**
   * Things to ignore.
   */
  ignore?: MonitorIgnore;
}

export interface MonitorIgnore {
  bots?: boolean;
  self?: boolean;
  others?: boolean;
  webhooks?: boolean;
  edits?: boolean;
}

export class MonitorHandler extends Handler<Monitor> {
  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options: HandlerOptions);
}

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

export abstract class Provider<V extends any> {
  items: Store<string, V>;

  abstract init(): Promise<unknown>;

  abstract get<T>(id: string, path?: string): T | V;

  abstract delete(id: string, path?: string): unknown | Promise<unknown>;

  abstract update(id: string, value: unknown, path?: string): unknown | Promise<unknown>;
}

export const blade: Extender<unknown, {
  Context: typeof Context;
  CommandDispatcher: typeof CommandDispatcher;
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
   * @param number The number to parse.
   * @param long Whether or not to return the long version.
   * @since 1.0.0
   */
  static parse(number: number, long?: boolean): string;
  /**
   * Parses a string into milliseconds.
   * @param string The string to parse.
   * @since 1.0.0
   */
  static parse(string: string): number;
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
 * Combines two words into one.
 * @param a The first word
 * @param b The second word
 * @author Sxmurai
 */
export function combine(a: string, b: string): string;

/**
 * A helper function for determining if a value is an event emitter.
 * @param input
 * @since 2.0.0
 */
export function isEmitter(input: unknown): input is EventEmitterLike;

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

/**
 * A helper function for determining whether or not a value is a promise,
 * @param value
 */
export function isPromise(value: unknown): value is Promise<unknown>;

// eslint-disable-next-line @typescript-eslint/ban-types
export function intoCallable(value: unknown): Function;

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

/**
 * Merges objects into one.
 * @param objects The objects to merge.
 */
export function mergeObjects<O extends Dictionary = Dictionary>(...objects: Partial<O>[]): O;

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

export class InhibitorHandler extends Handler<Inhibitor> {
  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: HandlerOptions);

  /**
   * Tests inhibitors.
   * @param type The type of inhibitors to test.
   * @param ctx
   * @param command
   */
  test(type: InhibitorType, ctx: Context, command?: Command): Promise<string | void | null>;
}

export class Inhibitor extends Module<InhibitorOptions> {
  /**
   * The typeof inhibitor this is.
   */
  type: InhibitorType;
  /**
   * The priority of this inhibitor.
   */
  priority: number;

  /**
   * @param client
   * @param options
   */
  constructor(client: BladeClient, options?: InhibitorOptions);

  /**
   * The reason to use when this inhibitor trips.
   */
  get reason(): string;

  /**
   * Run this inhibitor.
   * @param ctx The context instance.
   * @param command The command if the type of this inhibitor is not "all"
   */
  run(ctx: Context, command?: Command): boolean | unknown | Promise<boolean | unknown>;

  /**
   * @private
   */
  _run(ctx: Context, command?: Command): Promise<boolean | unknown>;
}

/**
 * The type of inhibitor
 * - "command": Runs on messages that invoke a command.
 * - "all": Runs on all messages.
 * - "pre-command": Runs before the message is checked if the message invokes a command..
 */
export type InhibitorType = "command" | "all" | "pre-command";

export interface InhibitorOptions extends ModuleOptions {
  type?: InhibitorType;
  reason?: string;
  priority?: number;
}

