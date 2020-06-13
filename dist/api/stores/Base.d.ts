import { LiteEmitter } from "../../utils/LiteEmitter";
import { Component, ComponentOptions } from "../components/Base";
import { Storage } from "../../utils/Storage";
import type { BladeClient } from "../Client";
export declare type LoadFilter = (file: string) => boolean | Promise<boolean>;
export declare type ComponentResolvable<T> = string | T;
export interface ComponentStoreOptions {
    classToHandle?: typeof Component;
    priority?: number;
    loadFilter?: LoadFilter;
    autoCategory?: boolean;
    defaults?: ComponentOptions;
    createDirectory?: boolean;
    directory?: string;
}
/**
 * A component store.
 * @since 1.0.0
 */
export declare abstract class ComponentStore<T extends Component> extends LiteEmitter {
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
