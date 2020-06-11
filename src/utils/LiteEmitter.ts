import { GenericError } from "@ayanaware/errors";


type LiteEmitterHandler = (...args: Array<any>) => void;

/**
 * An error that's created whenever a handler has throw an error.
 */
export class LiteEmitterError extends GenericError {
}

/**
 * A simplified EventEmitter.
 * @since 1.0.0
 */
export class LiteEmitter {
  private readonly _handlers: Map<string, Set<LiteEmitterHandler>> = new Map();

  /**
   * Add a handler function for a given event.
   * @param event The name of the event.
   * @param fn The handler function.
   */
  public addListener(event: string, fn: LiteEmitterHandler): this {
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());

    const handlers = this._handlers.get(event)!;
    handlers.add(fn);

    return this;
  }

  /**
   * Remove one or all handler functions for a given event.
   * @param event The name of the event.
   * @param fn Optional handler to detach.
   */
  public removeListener(event: string, fn?: LiteEmitterHandler): this {
    const handlers = this._handlers.get(event);
    if (!handlers) return this;

    if (fn && handlers.has(fn)) {
      handlers.delete(fn);
      if (handlers.size === 0) this._handlers.delete(event);
    } else {
      this._handlers.delete(event);
    }

    return this;
  }

  /**
   * Add a handler function for a given event.
   * @param event The name of the event.
   * @param callback
   */
  public on(event: string, callback: LiteEmitterHandler): this {
    this.addListener(event, callback);

    return this;
  }

  /**
   * Emit a new event to handlers.
   * @param event The name of the event.
   * @param args Event arguments.
   */
  public emit(event: string, ...args: Array<any>): this {
    const handlers = this._handlers.get(event);
    if (!handlers) return this;

    for (const handler of handlers) {
      try {
        handler(...args);
      } catch (e) {
        if (event === "error") throw new LiteEmitterError(`Caught Error in "error" handler function`).setCause(e);
        this.emit('error', new LiteEmitterError(`Caught Error in handler function`).setCause(e));
      }
    }

    return this;
  }
}