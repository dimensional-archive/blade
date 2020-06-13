import type { ComponentStore } from "../stores/Base";
import type { BladeClient } from "../Client";
import { Logger } from "@ayanaware/logger";
export interface ComponentOptions {
    name?: string;
    disabled?: boolean;
    category?: string;
}
/**
 * An abstracted base class for all components like Command and Listener.
 * @since 1.0.0
 * @abstract
 */
export declare abstract class Component {
    /**
     * This components logger.
     * @since 1.0.4
     */
    readonly logger: Logger;
    /**
     * The blade client.
     * @since 1.0.0
     */
    readonly client: BladeClient;
    /**
     * THe store this component belongs to
     * @since 1.0.0
     */
    readonly store: ComponentStore<Component>;
    /**
     * The file array of this component.
     * @since 1.0.0
     */
    file: string[];
    /**
     * The directory that holds this component.
     * @since 1.0.0
     */
    directory: string;
    /**
     * THe name of this component
     * @since 1.0.0
     */
    name: string;
    /**
     * Whether this component is disabled or not
     * @since 1.0.0
     */
    disabled: boolean;
    /**
     * The full category of this component.
     * @since 1.0.0
     */
    fullCategory: string[];
    protected constructor(store: ComponentStore<Component>, directory: string, file: string[], options?: ComponentOptions);
    private static _defaults;
    static set defaults(defaults: ComponentOptions);
    /**
     * The full path of this component
     * @since 1.0.0
     */
    get path(): string;
    /**
     * The category of this component.
     * @since 1.0.0
     */
    get category(): string;
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating the component
     * @constructor
     */
    static Setup(options?: ComponentOptions): <T extends new (...args: any[]) => Component>(t: T) => T;
    /**
     * Called once the bot is ready.
     */
    init(client: BladeClient): void;
    /**
     * Reloads this piece.
     * @since 1.0.0
     */
    reload(): Promise<Component>;
    /**
     * Remove this piece from the store.
     * @since 1.0.0
     */
    unload(): Component | null;
    /**
     * Disables this component.
     * @since 1.0.0
     */
    disable(): this;
    /**
     * Enables this component.
     * @since 1.0.0
     */
    enable(): Promise<Component>;
}
