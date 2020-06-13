import { Client, ClientOptions, Member, OAuthApplicationInfo, User } from "eris";
import { ComponentStore } from "./stores/Base";
import { Component } from "./components/Base";
import { ClientUtil } from "../utils/ClientUtil";
import { Logger } from "@ayanaware/logger";
export interface BladeClientOptions extends ClientOptions {
    directory?: string;
    token: string;
    owners?: string | string[];
}
/**
 * The base class for creating a bot.
 * @extends Client
 * @since 1.0.0
 */
export declare class BladeClient extends Client {
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
