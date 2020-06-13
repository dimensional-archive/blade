import {
  Base,
  Client,
  ClientOptions,
  Collection,
  EmbedOptions,
  Emoji,
  Guild,
  GuildChannel,
  Member,
  Message,
  MessageContent,
  MessageFile,
  OAuthApplicationInfo,
  Permission,
  PrivateChannel,
  Role,
  TextableChannel,
  TextChannel,
  User,
  VoiceChannel
} from "eris";
import { GenericError } from "@ayanaware/errors";
import { EventIterator, EventIteratorOptions } from "@klasa/event-iterator/dist";
import { Logger } from "@ayanaware/logger";
import { EventEmitter } from "events";

declare module "@kyu/blade" {

  export class ClientUtil {
    resolveUser(text: string, users: Collection<User>, caseSensitive?: boolean, wholeWord?: boolean): User | undefined;

    resolveUsers(text: string, users: Collection<User>, caseSensitive?: boolean, wholeWord?: boolean): User[];

    checkUser(text: string, user: User, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    resolveMember(text: string, members: Collection<Member>, caseSensitive?: boolean, wholeWord?: boolean): Member | undefined;

    resolveMembers(text: string, members: Collection<Member>, caseSensitive?: boolean, wholeWord?: boolean): Member[];

    checkMember(text: string, member: Member, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    resolveChannel(text: string, channels: Collection<any>, caseSensitive?: boolean, wholeWord?: boolean): Channel | undefined;

    resolveChannels(text: string, channels: Collection<any>, caseSensitive?: boolean, wholeWord?: boolean): Channel[];

    checkChannel(text: string, channel: Channel, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    resolveRole(text: string, roles: Collection<Role>, caseSensitive?: boolean, wholeWord?: boolean): Role | undefined;

    resolveRoles(text: string, roles: Collection<Role>, caseSensitive?: boolean, wholeWord?: boolean): Role[];

    checkRole(text: string, role: Role, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    resolveEmoji(text: string, emojis: Emoji[], caseSensitive?: boolean, wholeWord?: boolean): Emoji;

    resolveEmojis(text: string, emojis: Emoji[], caseSensitive?: boolean, wholeWord?: boolean): Emoji[];

    checkEmoji(text: string, emoji: Emoji, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    resolveGuild(text: string, guilds: Collection<Guild>, caseSensitive?: boolean, wholeWord?: boolean): Guild | undefined;

    resolveGuilds(text: string, guilds: Collection<Guild>, caseSensitive?: boolean, wholeWord?: boolean): Guild[];

    checkGuild(text: string, guild: Guild, caseSensitive?: boolean, wholeWord?: boolean): boolean;

    awaitMessages(channel: TextableChannel, options: MessageCollectorOptions): Promise<Storage<string, Message>>;
  }

  export class BladeClient extends Client {
    static basePermissions: (2048 | 1024)[];
    readonly logger: Logger;
    readonly util: ClientUtil;
    app?: OAuthApplicationInfo;
    directory: string;
    started: boolean;
    owners: Set<User>;
    options: BladeClientOptions;

    constructor(options: BladeClientOptions);

    get invite(): string | null;

    use(store: ComponentStore<Component>): this;

    start(): Promise<this>;

    isOwner(resolvable: User | Member): boolean;
  }

  export class Permissions {
    static topRole(member: Member): Role | undefined;

    static above(a: Member, b: Member): boolean;

    static permissionsOf(role: Role, channel: GuildChannel): number;

    static toString(permission: number): string;

    static overlaps(user: number, required: number): boolean;

    static add(...a: number[]): number;
  }

  export class Monitor extends Component {
    readonly store: MonitorStore;

    static Setup(options: ComponentOptions): <T extends new (...args: any[]) => Component>(t: T) => T;

    run(message: Message): Promise<void>;

    _ran(message: Message): Promise<void>;
  }

  export abstract class ComponentStore<T extends Component> extends LiteEmitter {
    readonly client: BladeClient;
    readonly components: Storage<string, T>;
    name: string;
    priority: number;
    classToHandle: typeof Component;
    loadFilter: LoadFilter;
    createDirectory: boolean;
    directory: string;

    protected constructor(client: BladeClient, name: string, options?: ComponentStoreOptions);

    static walkDir(store: ComponentStore<Component>, dir: string): Promise<Component>[];

    load(directory: string, file: string[]): Promise<T>;

    loadAll(): Promise<number>;

    resolve(resolvable: ComponentResolvable<T>): T | undefined;

    remove(resolvable: ComponentResolvable<T>): T | null;

    add(component: T): T | null;

    toString(): string;
  }

  export class MonitorStore extends ComponentStore<Monitor> {
    emitter: LiteEmitter;

    constructor(client: BladeClient, options?: ComponentStoreOptions);

    remove(resolvable: ComponentResolvable<Monitor>): Monitor | null;

    add(component: Monitor): Monitor | null;
  }

  export abstract class Component {
    readonly logger: Logger;
    readonly client: BladeClient;
    readonly store: ComponentStore<Component>;
    file: string[];
    directory: string;
    name: string;
    disabled: boolean;
    fullCategory: string[];

    protected constructor(store: ComponentStore<Component>, directory: string, file: string[], options?: ComponentOptions);

    static set defaults(defaults: ComponentOptions);

    get path(): string;

    get category(): string;

    static Setup(options?: ComponentOptions): <T extends new (...args: any[]) => Component>(t: T) => T;

    init(client: BladeClient): void;

    reload(): Promise<Component>;

    unload(): Component | null;

    disable(): this;

    enable(): Promise<Component>;
  }

  export class Inhibitor extends Component {
    type: InhibitorType;
    reason: string;
    priority: number;

    constructor(store: InhibitorStore, dir: string, path: string[], options?: InhibitorOptions);

    run(...args: any[]): boolean | Promise<boolean>;
  }

  export class ListenerStore extends ComponentStore<Listener> {
    emitters: Record<string, Emitter>;

    constructor(client: BladeClient, options?: ListenerStoreOptions);

    remove(resolvable: ComponentResolvable<Listener>): Listener | null;

    add(component: Listener): Listener | null;
  }

  export class InhibitorStore extends ComponentStore<Inhibitor> {
    constructor(client: BladeClient, options?: ComponentStoreOptions);

    test(type: InhibitorType, message: Message, command?: Command): Promise<string | null>;
  }

  export class MessageCollector extends Collector<Message, [ Message ], MessageIterator> {
    constructor(channel: TextableChannel | PrivateChannel, options: MessageCollectorOptions);
  }

  export class Collector<T extends Base, R extends [ T, ...unknown[] ], I extends EventIterator<R>> {
    protected collected: Storage<string, T>;

    constructor(iterator: I);

    collect(): Promise<Storage<string, T>>;
  }

  export class Storage<K, V> extends Map<K, V> {
    get first(): [ K, V ] | null;

    get firstValue(): V | null;

    get firstKey(): K | null;

    get last(): [ K, V ] | null;

    get lastValue(): V | null;

    get lastKey(): K | null;

    find(fn: (value: V, key?: K, map?: this) => boolean, thisArg?: any): V | undefined;

    findKey(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): K | undefined;

    findValue(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): V | undefined;

    sweep(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): number;

    filter(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): Storage<K, V>;

    map<T = any>(fn: (value: V, key: K, map: this) => T, thisArg?: any): T[];

    some(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;

    every(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;

    reduce<I>(fn: (accumulator: I, value: V, key: K, map: this) => I, initialValue: I, thisArg?: any): I;

    clone(): Storage<K, V>;

    concat(...Storages: Storage<K, V>[]): Storage<K, V>;

    equals(Storage: Storage<K, V>): boolean;

    sort(compareFunction?: (v0: V, v1: V, k0?: K, k1?: K) => number): this;

    sorted(compareFunction?: (v0: V, v1: V, k0?: K, k1?: K) => number): Storage<K, V>;
  }

  export class MessageIterator extends EventIterator<[ Message ]> {
    constructor(channel: TextableChannel | PrivateChannel, options?: MessageIteratorOptions);
  }

  export abstract class Util {
    static array<T>(v: T | T[]): T[];

    static isFunction(i: any): i is Function;

    static isClass(input: unknown): boolean;

    static walk(directory: string, files?: string[]): string[];

    static deepAssign<T>(o1: any, ...os: any[]): T;

    static flatMap(xs: any[], f: Function): any[];

    static intoCallable(thing: any): (...args: any[]) => any;

    static isPromise(value: any): value is Promise<any>;

    static prefixCompare(aKey: string | Function, bKey: string | Function): number;

    static choice<T>(...xs: T[]): T | null;
  }

  export class EmbedBuilder {
    constructor(data?: Embed);

    static get default(): EmbedBuilder;

    color(color: number): EmbedBuilder;

    title(title: string): EmbedBuilder;

    description(text: string): EmbedBuilder;

    author(name: string, url?: string, iconURL?: string): EmbedBuilder;

    thumbnail(url: string): EmbedBuilder;

    field(name: string, value: string, inline?: boolean): EmbedBuilder;

    image(url: string): EmbedBuilder;

    timestamp(t?: Date): EmbedBuilder;

    footer(txt: string, iconURL?: string): EmbedBuilder;

    url(url: string): EmbedBuilder;

    build(): EmbedOptions;
  }

  export class LiteEmitterError extends GenericError {
  }

  export class LiteEmitter {

    handlerCount(event: string): number;

    addListener(event: string, fn: LiteEmitterHandler): this;

    removeListener(event: string, fn?: LiteEmitterHandler): this;

    on(event: string, callback: LiteEmitterHandler): this;

    once(event: string, callback: LiteEmitterHandler): this;

    emit(event: string, ...args: Array<any>): this;
  }

  export class Command extends Component {
    readonly store: CommandStore;
    readonly locker: Set<KeySupplier>;
    aliases: string[];
    description: CommandDescription;
    restrictions: Restrictions[];
    channel: AllowedChannels[];
    userPermissions: Permission[];
    permissions: Permission[];
    inhibitors: string[];
    editable: boolean;
    bucket: number;
    cooldown: number;
    cooldownType: CooldownType;
    hidden: boolean;
    guarded: boolean;
    prefix: string[] | PrefixProvider | null;
    argumentDefaults: DefaultArgumentOptions;
    before: Before;
    condition: ExecutionPredicate;
    regex: RegExp | RegexProvider | null;
    lock: KeySupplier | null;

    constructor(store: CommandStore, dir: string, file: string[], options?: CommandOptions);

    get userPermissionsBytecode(): number;

    get permissionsBytecode(): number;

    static Setup(options?: CommandOptions): <T extends new (...args: any[]) => Component>(t: T) => T;

    run(ctx: Context, args?: Record<string, any>): any | Promise<any>;

    parse(message: Message, content: string): Promise<any>;
  }


  export class CommandStore extends ComponentStore<Command> {
    readonly types: TypeResolver;
    inhibitors?: InhibitorStore;
    handling: HandlingOptions;
    defaultCooldown: number;
    aliases: Storage<string, string>;
    prefixes: Storage<string | PrefixProvider, Set<string>>;

    constructor(client: BladeClient, options?: CommandStoreOptions);

    add(component: Command): Command | null;

    remove(resolvable: ComponentResolvable<Command>): Command | null;

    useInhibitorStore(inhibitorStore: InhibitorStore): this;

    useMonitorStore(inhibitorStore: MonitorStore): this;

    useListenersStore(listenerStore: ListenerStore): this;

    findCommand(id: string): Command | undefined;

    handle(message: Message): Promise<boolean>;

    handleRegexAndConditionalCommands(message: Message): Promise<boolean>;

    handleRegexCommands(message: Message): Promise<boolean>;

    handleConditionalCommands(message: Message): Promise<boolean>;

    handleDirectCommand(message: Message, content: string, command: Command, ignore?: boolean): Promise<null | void | boolean>;

    runCommand(message: Message, command: Command, args: Record<string, any>): Promise<void>;

    parseCommand(message: Message): Promise<ContextData>;

    parseMultiplePrefixes(message: Message, pairs: [ string, Set<string> | null ][]): ContextData;

    parseWithPrefix(message: Message, prefix: string, associatedCommands?: Set<string> | null): ContextData;

    parseCommandOverwrittenPrefixes(message: Message): Promise<ContextData>;

    runAllTypeInhibitors(message: Message): Promise<boolean>;

    runPreTypeInhibitors(message: Message): Promise<boolean>;

    runPostTypeInhibitors(message: Message, command: Command): Promise<boolean>;

    runAllCommandInhibitors(message: Message, command: Command): Promise<boolean>;

    runPermissionChecks(message: Message, command: Command): Promise<boolean>;

    addPrompt(channel: Channel, user: User): void;

    removePrompt(channel: Channel, user: User): void;

    hasPrompt(channel: Channel, user: User): boolean;
  }

  export class Listener extends Component {
    readonly store: ListenerStore;
    event: string | string[];
    emitter: Emitter;
    mappings: Mappings;
    mode: Mode;

    constructor(store: ListenerStore, dir: string, file: string[], options: ListenerOptions);

    static Setup(options: ListenerOptions): <T extends new (...args: any[]) => Component>(t: T) => T;

    run(...args: any[]): any | Promise<any>;

    _listen(this: Listener): void;

    _unListen(): void;
  }

  export class Context {
    readonly store: CommandStore;
    readonly client: BladeClient;
    readonly message: Message;
    command?: Command;
    parsed?: ContextData;
    shouldEdit: boolean;
    lastResponse?: Message;
    messages: Map<string, Message> | null;

    constructor(store: CommandStore, message: Message);

    get guild(): Guild | undefined;

    get author(): User;

    get member(): Member | undefined;

    get channel(): TextableChannel;

    get me(): Member;

    static getTransformed(context: Context, message: Content): Promise<MessageContent>;

    reply(content: Content): Promise<Message>;

    sendNew(content: Content): Promise<Message>;

    edit(content: Content): Promise<Message>;

    addMessage(message: Message | Message[]): Message | Message[];

    setLastResponse(message: Message | Message[]): Message;

    setEditable(state: boolean): this;
  }

  export class ReplyBuilder {
    readonly ctx: Context;

    constructor(ctx: Context);

    content(str: string): ReplyBuilder;

    tts(value: boolean): ReplyBuilder;

    file(file: MessageFile): ReplyBuilder;

    embed(embed: EmbedOptions | EmbedBuilder | ((builder: EmbedBuilder, ctx: Context) => EmbedBuilder)): ReplyBuilder;

    display(tc: TextableChannel): Promise<Message>;

    build(): [ MessageContent, MessageFile[] ];
  }

  export class Ratelimit {
    bucket: number;
    cooldown: number;
    private remaining;
    private time;

    constructor(bucket: number, cooldown: number);

    get expired(): boolean;

    get limited(): boolean;

    get remainingTime(): number;

    drip(): this;

    reset(): this;

    resetRemaining(): this;

    resetTime(): this;
  }

  export class RatelimitManager<K = string> extends Storage<K, Ratelimit> {
    private sweepInterval;

    constructor(bucket: number, cooldown: number);

    static get [Symbol.species](): typeof Storage;

    private _bucket;
    get bucket(): number;
    set bucket(value: number);

    private _cooldown;
    get cooldown(): number;
    set cooldown(value: number);

    acquire(id: K): Ratelimit;

    create(id: K): Ratelimit;

    set(id: K, ratelimit: Ratelimit): this;

    sweep(fn?: (value: Ratelimit, key: K, collection: this) => boolean, thisArg?: any): number;
  }

  export class Argument {
    command: Command;
    match: ArgumentMatch;
    type: ArgumentType | ArgumentTypeCaster;
    flag?: string | string[];
    multipleFlags: boolean;
    index?: number;
    unordered: boolean | number | number[];
    limit: number;
    prompt?: ArgumentPromptOptions;
    default: any | Supplier<FailureData, any>;
    otherwise?: Content | Supplier<FailureData, Content>;
    modifyOtherwise: Modifier<FailureData, Content>;

    constructor(command: Command, { match, type, flag, multipleFlags, index, unordered, limit, prompt, default: defaultValue, otherwise, modifyOtherwise, }?: ArgumentOptions);

    get client(): BladeClient;

    get handler(): CommandStore;

    static cast(type: ArgumentType | ArgumentTypeCaster, resolver: TypeResolver, message: Message, phrase: string): Promise<any>;

    static union(...types: (ArgumentType | ArgumentTypeCaster)[]): ArgumentTypeCaster;

    static product(...types: (ArgumentType | ArgumentTypeCaster)[]): ArgumentTypeCaster;

    static validate(type: ArgumentType | ArgumentTypeCaster, predicate: ParsedValuePredicate): ArgumentTypeCaster;

    static range(type: ArgumentType | ArgumentTypeCaster, min: number, max: number, inclusive?: boolean): ArgumentTypeCaster;

    static compose(...types: (ArgumentType | ArgumentTypeCaster)[]): ArgumentTypeCaster;

    static composeWithFailure(...types: (ArgumentType | ArgumentTypeCaster)[]): ArgumentTypeCaster;

    static withInput(type: ArgumentType | ArgumentTypeCaster): ArgumentTypeCaster;

    static tagged(type: ArgumentType | ArgumentTypeCaster, tag?: string | RegExp | ArgumentTypeCaster | (string | string[])[]): ArgumentTypeCaster;

    static taggedWithInput(type: ArgumentType | ArgumentTypeCaster, tag?: string | RegExp | ArgumentTypeCaster | (string | string[])[]): ArgumentTypeCaster;

    static taggedUnion(...types: (ArgumentType | ArgumentTypeCaster)[]): ArgumentTypeCaster;

    static isFailure(value: any): boolean;

    process(message: Message, phrase: string): Promise<Flag | any>;

    cast(message: Message, phrase: string): Promise<any>;

    collect(message: Message, commandInput?: string, parsedInput?: any): Promise<Flag | any>;
  }

  export class ArgumentRunner {
    command: Command;

    constructor(command: Command);

    get client(): BladeClient;

    get handler(): CommandStore;

    static increaseIndex(parsed: ContentParserResult, state: ArgumentRunnerState, n?: number): void;

    static isShortCircuit(value: any): boolean;

    static fromArguments(args: [ string, Argument ][]): ArgumentGenerator;

    run(message: Message, parsed: ContentParserResult, generator: ArgumentGenerator): Promise<any>;

    runOne(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runPhrase(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<any>;

    runRest(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runSeparate(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runFlag(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runOption(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runText(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runContent(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runRestContent(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;

    runNone(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
  }

  export class ContentParser {
    flagWords: string[];
    optionFlagWords: string[];
    quoted: boolean;
    separator: string;

    constructor({ flagWords, optionFlagWords, quoted, separator }?: ContentParserOptions);

    static getFlags(args: ArgumentOptions[]): Record<string, string[]>;

    parse(content: string): ContentParserResult;
  }

  export class Flag {
    type: string;
    command?: string;
    ignore?: boolean;
    rest?: string;
    message?: Message;
    value?: any;

    constructor(type: string, data?: Record<string, any>);

    static cancel(): Flag;

    static retry(message: Message): Flag;

    static fail(value: any): Flag;

    static continue(command: string, ignore?: boolean, rest?: null): Flag;

    static is(value: any, type: string): boolean;
  }

  export class TypeResolver {
    handler: CommandStore;
    client: BladeClient;
    types: Storage<string, ArgumentTypeCaster>;
    commands: CommandStore;
    inhibitors: InhibitorStore | null;
    listeners: ListenerStore | null;
    monitors: MonitorStore | null;

    constructor(handler: CommandStore);

    addBuiltInTypes(): void;

    type(name: string): ArgumentTypeCaster;

    addType(name: string, fn: ArgumentTypeCaster): TypeResolver;

    addTypes(types: Record<string, ArgumentTypeCaster>): TypeResolver;
  }


  /** Types & Interfaces */
  export interface ContentParserOptions {
    flagWords?: string[];
    optionFlagWords?: string[];
    quoted?: boolean;
    separator?: string;
  }

  export interface StringData {
    type: "Phrase" | "Flag" | "OptionFlag";
    raw: string;
    key?: string;
    value?: string;
  }

  export interface ExtractedFlags {
    flagWords: string[];
    optionFlagWords: string[];
  }

  export interface ArgumentOptions {
    id?: string;
    match?: ArgumentMatch;
    flag?: string | string[];
    type?: ArgumentType | ArgumentTypeCaster;
    multipleFlags?: boolean;
    index?: number;
    unordered?: boolean | number | number[];
    limit?: number;
    default?: any | Supplier<FailureData, any>;
    otherwise?: Content | Supplier<FailureData, Content>;
    modifyOtherwise?: Modifier<FailureData, Content>;
    prompt?: ArgumentPromptOptions;
  }

  export interface ArgumentPromptData {
    retries: number;
    infinite: boolean;
    message: Message;
    phrase: string;
    failure: void | Flag;
  }

  export interface ArgumentPromptOptions {
    retries?: number;
    time?: number;
    cancelWord?: string;
    optional?: boolean;
    infinite?: boolean;
    limit?: number;
    breakout?: boolean;
    start?: MessageContent | Supplier<ArgumentPromptData, Content>;
    retry?: MessageContent | Supplier<ArgumentPromptData, Content>;
    timeout?: MessageContent | Supplier<ArgumentPromptData, Content>;
    ended?: MessageContent | Supplier<ArgumentPromptData, Content>;
    cancel?: MessageContent | Supplier<ArgumentPromptData, Content>;
    stopWord?: string;
    modifyStart?: Modifier<ArgumentPromptData, Content>;
    modifyRetry?: Modifier<ArgumentPromptData, Content>;
    modifyTimeout?: Modifier<ArgumentPromptData, Content>;
    modifyEnded?: Modifier<ArgumentPromptData, Content>;
    modifyCancel?: Modifier<ArgumentPromptData, Content>;
  }

  export interface FailureData {
    phrase: string;
    failure: void | Flag;
  }

  export interface DefaultArgumentOptions {
    prompt?: ArgumentPromptOptions;
    otherwise?: Content | Supplier<FailureData, Content>;
    modifyOtherwise?: Modifier<FailureData, Content>;
  }

  export type ArgumentMatch =
    "phrase"
    | "flag"
    | "option"
    | "rest"
    | "separate"
    | "text"
    | "content"
    | "restContent"
    | "none";
  export type ArgumentType =
    "string"
    | "lowercase"
    | "uppercase"
    | "charCodes"
    | "number"
    | "integer"
    | "bigint"
    | "emojint"
    | "url"
    | "date"
    | "color"
    | "user"
    | "users"
    | "member"
    | "members"
    | "relevant"
    | "relevants"
    | "channel"
    | "channels"
    | "textChannel"
    | "textChannels"
    | "voiceChannel"
    | "voiceChannels"
    | "categoryChannel"
    | "categoryChannels"
    | "newsChannel"
    | "newsChannels"
    | "storeChannel"
    | "storeChannels"
    | "role"
    | "roles"
    | "emoji"
    | "emojis"
    | "guild"
    | "guilds"
    | "message"
    | "guildMessage"
    | "relevantMessage"
    | "invite"
    | "userMention"
    | "memberMention"
    | "channelMention"
    | "roleMention"
    | "emojiMention"
    | "commandAlias"
    | "command"
    | "inhibitor"
    | "listener"
    | (string | string[])[]
    | RegExp
    | string;

  export type Modifier<D, T> = (ctx?: Context, text?: Content, data?: D) => T | Promise<T>;

  export type Supplier<D, T> = (message: Message, data?: D) => T | Promise<T>;

  export type ArgumentTypeCaster = (message: Message, value?: any) => any;

  export type ParsedValuePredicate = (message?: Message, phrase?: string, value?: any) => boolean;

  export interface ContentParserResult {
    all: StringData[];
    phrases: StringData[];
    flags: StringData[];
    optionFlags: StringData[];
  }

  export type ArgumentGenerator = (ctx: Context, parsed: ContentParserResult, state: ArgumentRunnerState) => IterableIterator<ArgumentOptions | Flag>;

  export interface ArgumentRunnerState {
    usedIndices: Set<number>;
    phraseIndex: number;
    index: number;
  }

  export type Content =
    MessageContent
    | EmbedBuilder
    | ((builder: ReplyBuilder, ctx: Context) => ReplyBuilder | Promise<ReplyBuilder>);

  export interface ContextData {
    afterPrefix?: string;
    alias?: string;
    command?: Command;
    content?: string;
    prefix?: string;
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
    COMMAND_FINISHED = "commandFinished"
  }

  export enum PreDefinedReason {
    SELF = "blockedSelf",
    BOT = "blockedBot",
    GUILD = "guild",
    DM = "dm",
    DEVELOPER = "developer"
  }

  export interface ListenerStoreOptions extends ComponentStoreOptions {
    emitters?: Record<string, Emitter>;
  }

  export type LoadFilter = (file: string) => boolean | Promise<boolean>;

  export type ComponentResolvable<T> = string | T;

  export interface ComponentStoreOptions {
    classToHandle?: typeof Component;
    priority?: number;
    loadFilter?: LoadFilter;
    autoCategory?: boolean;
    defaults?: ComponentOptions;
    createDirectory?: boolean;
    directory?: string;
  }

  export type LiteEmitterHandler = (...args: Array<any>) => void;

  export type IgnorePermissions = (message: Message, command: Command) => boolean;
  export type IgnoreCooldown = (message: Message, command: Command) => boolean;
  export type PrefixProvider = (ctx: Context) => string | string[] | Promise<string | string[]>;

  export interface HandlingOptions {
    prefix?: string | string[] | PrefixProvider;
    handleEdits?: boolean;
    enabled?: boolean;
    allowBots?: boolean;
    allowSelf?: boolean;
    allowUsers?: boolean;
    ignorePermissions?: string | string[] | IgnorePermissions;
    aliasReplacement?: RegExp;
    ignoreCooldown?: string | string[] | IgnoreCooldown;
    storeMessages?: boolean;
    sendTyping?: boolean;
    argumentDefaults?: DefaultArgumentOptions;
  }

  export interface ComponentOptions {
    name?: string;
    disabled?: boolean;
    category?: string;
  }

  export type InhibitorType = "all" | "pre" | "post" | "command";

  export interface CommandStoreOptions extends ComponentStoreOptions {
    handling?: HandlingOptions;
    defaultCooldown?: number;
  }

  export interface Embed {
    title?: string;
    description?: string;
    image?: EmbedImage;
    author?: EmbedAuthor;
    thumbnail?: EmbedThumbnail;
    fields?: EmbedField[];
    timestamp?: Date;
    footer?: EmbedFooter;
    color?: number;
    type?: "rich";
    url?: string;
  }

  export interface MessageCollectorOptions {
    limit?: number;
    idle?: number;
    filter?: (message: [ Message ], collected: Storage<string, Message>) => boolean;
  }

  export interface EmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
  }

  export type CooldownType = "author" | "channel";
  export type Restrictions = "owner" | "guildOwner";
  export type AllowedChannels = "text" | "dm";
  export type RegexProvider = (ctx: Context) => RegExp | Promise<RegExp>;
  export type Before = (ctx: Context) => boolean | Promise<boolean>;
  export type KeySupplier = (ctx: Context, args?: any) => string;
  export type ExecutionPredicate = (ctx: Context) => boolean;

  export interface CommandDescription {
    content?: string;
    extendedContent?: string;
    usage?: string;
    examples?: string[];
  }

  export interface CommandOptions extends ComponentOptions {
    aliases?: string[];
    description?: CommandDescription;
    args?: ArgumentOptions[] | ArgumentGenerator;
    restrictions?: Restrictions | Restrictions[];
    channel?: AllowedChannels | AllowedChannels[];
    userPermissions?: Permission | Permission[];
    permissions?: Permission | Permission[];
    inhibitors?: string | string[];
    editable?: boolean;
    bucket?: number;
    cooldown?: number;
    cooldownType?: CooldownType;
    hidden?: boolean;
    guarded?: boolean;
    ignorePermissions?: string | string[] | IgnorePermissions;
    ignoreCooldown?: string | string[] | IgnoreCooldown;
    prefixes?: string | string[] | PrefixProvider;
    argumentDefaults?: DefaultArgumentOptions;
    regex?: RegExp | RegexProvider;
    before?: Before;
    flags?: string[];
    optionFlags?: string[];
    quoted?: boolean;
    separator?: string;
    lock?: "guild" | "channel" | "user" | KeySupplier;
    condition?: ExecutionPredicate;
  }

  export interface EmbedThumbnail {
    url?: string;
  }

  export interface EmbedImage {
    url?: string;
  }

  export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
  }

  export interface EmbedFooter {
    text: string;
    icon_url?: string;
  }

  export interface BladeClientOptions extends ClientOptions {
    directory?: string;
    token: string;
    owners?: string | string[];
  }

  export type Emitter = EventEmitter | LiteEmitter;

  export type Fn = (...args: any[]) => any;

  export type Mode = "once" | "on";

  export type Mappings = Record<string, Fn | string | ListenerMapping>;

  export interface ListenerOptions extends ComponentOptions {
    event: string | string[];
    emitter?: string | Emitter;
    mappings?: Record<string, ListenerMapping>;
    mode?: Mode;
  }

  export interface ListenerMapping {
    event: string;
    fn?: (...args: any) => any;
    emitter?: string | Emitter;
    mode?: Mode;
  }

  export interface InhibitorOptions extends ComponentOptions {
    type?: InhibitorType;
    reason?: string;
    priority?: number;
  }

  export type Channel = TextChannel | VoiceChannel;

  export type MessageIteratorOptions = EventIteratorOptions<[ Message ]>;

  export enum ArgumentMatches {
    PHRASE = "phrase",
    FLAG = "flag",
    OPTION = "option",
    REST = "rest",
    SEPARATE = "separate",
    TEXT = "text",
    CONTENT = "content",
    REST_CONTENT = "restContent",
    NONE = "none"
  }

  export enum ArgumentTypes {
    STRING = "string",
    LOWERCASE = "lowercase",
    UPPERCASE = "uppercase",
    CHAR_CODES = "charCodes",
    NUMBER = "number",
    INTEGER = "integer",
    BIGINT = "bigint",
    EMOJINT = "emojint",
    URL = "url",
    DATE = "date",
    COLOR = "color",
    USER = "user",
    USERS = "users",
    MEMBER = "member",
    MEMBERS = "members",
    CHANNEL = "channel",
    CHANNELS = "channels",
    TEXT_CHANNEL = "textChannel",
    TEXT_CHANNELS = "textChannels",
    VOICE_CHANNEL = "voiceChannel",
    VOICE_CHANNELS = "voiceChannels",
    CATEGORY_CHANNEL = "categoryChannel",
    CATEGORY_CHANNELS = "categoryChannels",
    NEWS_CHANNEL = "newsChannel",
    NEWS_CHANNELS = "newsChannels",
    STORE_CHANNEL = "storeChannel",
    STORE_CHANNELS = "storeChannels",
    ROLE = "role",
    ROLES = "roles",
    EMOJI = "emoji",
    EMOJIS = "emojis",
    GUILD = "guild",
    GUILDS = "guilds",
    MESSAGE = "message",
    GUILD_MESSAGE = "guildMessage",
    RELEVANT_MESSAGE = "relevantMessage",
    INVITE = "invite",
    USER_MENTION = "userMention",
    MEMBER_MENTION = "memberMention",
    CHANNEL_MENTION = "channelMention",
    ROLE_MENTION = "roleMention",
    EMOJI_MENTION = "emojiMention",
    COMMAND_ALIAS = "commandAlias",
    COMMAND = "command",
    INHIBITOR = "inhibitor",
    LISTENER = "listener"
  }
}