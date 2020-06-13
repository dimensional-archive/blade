/// <reference types="node" />
import { Component, ComponentOptions } from "./Base";
import type { ListenerStore } from "../stores/Listener";
import type { EventEmitter } from "events";
import type { LiteEmitter } from "../..";
export declare type Emitter = EventEmitter | LiteEmitter;
declare type Fn = (...args: any[]) => any;
declare type Mode = "once" | "on";
declare type Mappings = Record<string, Fn | string | ListenerMapping>;
export interface ListenerOptions extends ComponentOptions {
    /**
     * The event to listen for.
     */
    event: string | string[];
    /**
     * The emitter to attach the listener to.
     */
    emitter?: string | Emitter;
    /**
     * Event mappings for use with multiple events.
     */
    mappings?: Record<string, ListenerMapping>;
    /**
     * The listener mode.
     */
    mode?: Mode;
}
export interface ListenerMapping {
    event: string;
    fn?: (...args: any) => any;
    emitter?: string | Emitter;
    mode?: Mode;
}
/**
 * An abstract class for adding a listener to an emitter.
 * @since 1.0.0
 * @extends Component
 */
export declare class Listener extends Component {
    /**
     * The store this listener belongs to.
     */
    readonly store: ListenerStore;
    /**
     * The event or events to listen for.
     */
    event: string | string[];
    /**
     * The emitter to attach the listener to
     * @since 1.0.0
     */
    emitter: Emitter;
    /**
     * Event mappings for use with multiple events.
     * @since 1.0.0
     */
    mappings: Mappings;
    /**
     * The mode of the listener, "on" | "off" | "once"
     * @since 1.0.0
     */
    mode: Mode;
    /**
     * Map of events.
     * @since 1.0.0
     * @private
     */
    private _listeners;
    constructor(store: ListenerStore, dir: string, file: string[], options: ListenerOptions);
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options: ListenerOptions): <T extends new (...args: any[]) => Component>(t: T) => T;
    run(...args: any[]): any | Promise<any>;
    /**
     * Attaches the proper listener to the emitter
     * @since 1.0.0
     * @private
     */
    _listen(this: Listener): void;
    /**
     * Removes the listener from the emitter
     * @since 0.0.0-alpha
     * @private
     */
    _unListen(): void;
    private getEmitter;
    private getFunction;
}
export {};
