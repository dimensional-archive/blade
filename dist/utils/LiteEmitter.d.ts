import { GenericError } from "@ayanaware/errors";
declare type LiteEmitterHandler = (...args: Array<any>) => void;
/**
 * An error that's created whenever a handler has throw an error.
 */
export declare class LiteEmitterError extends GenericError {
}
/**
 * A simplified EventEmitter.
 * @since 1.0.0
 */
export declare class LiteEmitter {
    private readonly _handlers;
    /**
     * The amount of handlers for a given event.
     * @param event The event to get.
     * @since 1.0.0
     */
    handlerCount(event: string): number;
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param fn The handler function.
     */
    addListener(event: string, fn: LiteEmitterHandler): this;
    /**
     * Remove one or all handler functions for a given event.
     * @param event The name of the event.
     * @param fn Optional handler to detach.
     */
    removeListener(event: string, fn?: LiteEmitterHandler): this;
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param callback
     */
    on(event: string, callback: LiteEmitterHandler): this;
    /**
     * Add a handler function for a given event.
     * @param event The name of the event.
     * @param callback
     */
    once(event: string, callback: LiteEmitterHandler): this;
    /**
     * Emit a new event to handlers.
     * @param event The name of the event.
     * @param args Event arguments.
     */
    emit(event: string, ...args: Array<any>): this;
}
export {};
