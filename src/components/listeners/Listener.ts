import { array, blade, isPromise } from "../../util";

import type { EventEmitter } from "events";
import type { ModuleOptions } from "../base/Module";
import type { BladeClient } from "../../Client";
import type { ListenerHandler } from "./Handler";

export class Listener extends blade.get("Module") {
  /**
   * The listeners handler.
   */
  public handler!: ListenerHandler

  /**
   * The events this listener is for.
   */
  public event: string[];

  /**
   * Whether or not this listener is ran once.
   */
  public once: boolean;

  /**
   * The method map.
   */
  public map: Dictionary<string>;

  /**
   * Listeners.
   */
  private _listeners: Dictionary<Fn> = {}

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, public readonly options: ListenerOptions) {
    super(client, options);

    this.event = array(options.event);
    this.once = options.once ?? false;
    this.map = options.map ?? {};
  }

  /**
   * The emitter to listen on.
   */
  public get emitter(): EventEmitter {
    let emitter = this.options.emitter ?? this.client;
    if (typeof emitter === "string") {
      const _emitter = this.handler.emitters[emitter];
      if (!_emitter) throw new Error(`Emitter "${emitter}" does not exist.`);
      emitter = _emitter;
    }

    return emitter;
  }

  /**
   * Called whenever
   */
  public run(): void {
    return;
  }

  /**
   * @private
   */
  _listen(): this {
    if (this.event.length > 1) {
      for (const event of this.event) {
        const map = this.map[event];

        // @ts-ignore
        let fn = this[`on${event.capitalize()}`] as Fn;
        if (map) {
          // @ts-ignore
          const _fn = this[map] as Fn;
          if (_fn) fn = _fn;
        }

        fn = this.wrap(fn).bind(this);
        this.once
          ? this.emitter.once(event, fn)
          : this.emitter.on(event, fn);

        this._listeners[event] = fn;
      }

      return this;
    }

    const event = this.event[0],
      fn = this.wrap(this.run).bind(this);

    this._listeners[event] = fn;
    this.once
      ? this.emitter.once(event, fn)
      : this.emitter.on(event, fn);

    return this;
  }

  /**
   * @private
   */
  _unListen(): Listener {
    for (const event of this.event)
      this.emitter.removeListener(event, this._listeners[event]);

    return this;
  }

  /**
   * Wrap a function.
   * @param fn The function to wrap.
   * @since 1.0.0
   */
  private wrap(fn: Fn): Fn<Promise<void>> {
    return async (...args: unknown[]) => {
      try {
        let res = fn.call(this, ...args);
        if (isPromise(res)) res = await res;
        this.handler.emit("listenerRan", this, res);
      } catch (e) {
        this.handler.emit("listenerError", this, e);
        return;
      }
    };
  }
}

type Fn<R = unknown> = (...args: unknown[]) => R

export interface ListenerOptions extends ModuleOptions {
  event: string | string[];
  emitter?: string | EventEmitter;
  once?: boolean;
  map?: Dictionary<string>;
}
