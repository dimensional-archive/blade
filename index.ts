import { Client, ClientOptions, Member, OAuthApplicationInfo, User } from "eris";
import { Logger } from "@ayanaware/logger";

declare module "@kyu/blade" {
  /**
   * The base class for creating a bot.
   * @extends Client
   * @since 1.0.0
   */
  export class BladeClient extends Client {
    static basePermissions: (2048 | 1024)[];
    /**
     * This client's logger.
     * @since 1.0.4
     */
    readonly logger: Logger;
    /**
     * A utility class for resolving different classes like Emoji and Member.
     * @since 1.0.0
     */
    readonly util: ClientUtil;
    /**
     * Oauth2 Application Info.
     * @since 1.0.0
     */
    app?: OAuthApplicationInfo;
    /**
     * The base directory of the bot.
     * @since 1.0.0
     */
    directory: string;
    /**
     * Whether the client has been started or not.
     * @since 1.0.0
     */
    started: boolean;
    /**
     * A set of owners.
     */
    owners: Set<User>;
    options: BladeClientOptions;
    /**
     * A set of stores that are being used by the client.
     * @since 1.0.0
     */
    private readonly _stores;
    /**
     * Creates a new BladeClient.
     * @param options
     */
    constructor(options: BladeClientOptions);
    get invite(): string | null;
    /**
     * Uses a store.
     * @param store The store to use.
     */
    use(store: ComponentStore<Component>): this;
    /**
     * Starts the bot.
     * @since 1.0.0
     */
    start(): Promise<this>;
    /**
     * Check if a member or user is an owner.
     * @param resolvable The member/user to check.
     * @since 1.0.0
     */
    isOwner(resolvable: User | Member): boolean;
  }

  /**
   * A component store.
   * @since 1.0.0
   */
  export abstract class ComponentStore<T extends Component> extends LiteEmitter {
    private static _defaults;
    /**
     * The client that is using this store.
     * @since 1.0.0
     */
    readonly client: BladeClient;
    /**
     * All of the loaded components.
     * @since 1.0.0
     */
    readonly components: Storage<string, T>;
    /**
     * The name of this store.
     * @since 1.0.0
     */
    name: string;
    /**
     * The priority this store has when being loaded.
     * @since 1.0.0
     */
    priority: number;
    /**
     * The class this store handles / loads.
     * @since 1.0.0
     */
    classToHandle: typeof Component;
    /**
     * The load filter for this store.
     * @since 1.0.0
     */
    loadFilter: LoadFilter;
    /**
     * Whether to create the directory if none exists.
     * @since 1.0.0
     */
    createDirectory: boolean;
    /**
     * The directory to load from.
     * @since 1.0.0
     */
    directory: string;
    /**
     * Creates a new Component Store.
     * @param client The client that's using this store.
     * @param name The name of this store.
     * @param options The options to give this store.
     * @since 1.0.0
     */
    protected constructor(client: BladeClient, name: string, options?: ComponentStoreOptions);
    static walkDir(store: ComponentStore<Component>, dir: string): Promise<Component>[];
    load(directory: string, file: string[]): Promise<T>;
    /**
     * Loads all files in the given directory.
     * @since 1.0.0
     * @returns {number} Total components loaded.
     */
    loadAll(): Promise<number>;
    /**
     * Resolves a string or component into... a component.
     * @param resolvable
     * @returns {Component} The resolved component.
     */
    resolve(resolvable: ComponentResolvable<T>): T | undefined;
    /**
     * Removes a component from the store.
     * @param resolvable The component to remove.
     * @since 1.0.0
     */
    remove(resolvable: ComponentResolvable<T>): T | null;
    /**
     * Adds a component to the store.
     * @param component
     * @since 1.0.0
     */
    add(component: T): T | null;
    /**
     * Returns the string representation of this store.
     * @since 1.0.0
     */
    toString(): string;
  }

  /** Interfaces */

  export interface BladeClientOptions extends ClientOptions {
    directory?: string;
    token: string;
    owners?: string | string[];
  }

}
