import { Component, ComponentOptions } from "./Base";
import { MethodNotImplementedError } from "@ayanaware/errors";

import type { ListenerStore } from "../stores/Listener";
import type { EventEmitter } from "events";
import type { LiteEmitter } from "../..";

export type Emitter = EventEmitter | LiteEmitter;
type Fn = (...args: any[]) => any;
type Mode = "once" | "on";
type Mappings = Record<string, Fn | string | ListenerMapping>;

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
export class Listener extends Component {
  /**
   * The store this listener belongs to.
   */
  public readonly store!: ListenerStore;

  /**
   * The event or events to listen for.
   */
  public event: string | string[];
  /**
   * The emitter to attach the listener to
   * @since 1.0.0
   */
  public emitter: Emitter;
  /**
   * Event mappings for use with multiple events.
   * @since 1.0.0
   */
  public mappings: Mappings;
  /**
   * The mode of the listener, "on" | "off" | "once"
   * @since 1.0.0
   */
  public mode: Mode;
  /**
   * Map of events.
   * @since 1.0.0
   * @private
   */
  private _listeners: Record<string, (...args: any[]) => any> = {};


  public constructor(store: ListenerStore, dir: string, file: string[], options: ListenerOptions) {
    super(store, dir, file, options);

    const emitter = options.emitter ?? "client";

    this.event = options.event;
    this.emitter = typeof emitter === "string" ? store.emitters[emitter] : emitter;
    this.mappings = options.mappings ?? {};
    this.mode = options.mode ?? "on";
  }

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this listener.
   * @constructor
   */
  public static Setup(options: ListenerOptions): <T extends new (...args: any[]) => Component>(t: T) => T {
    return Component.Setup(options);
  }


  public run(...args: any[]): any | Promise<any> {
    throw new MethodNotImplementedError();
  }

  /**
   * Attaches the proper listener to the emitter
   * @since 1.0.0
   * @private
   */
  public _listen(this: Listener): void {
    if (Array.isArray(this.event)) {
      this.event.forEach((event) => {
        if (this.mappings) {
          const mapping = this.mappings[event];
          if (mapping) {
            if (typeof mapping === "object") {
              const fn = this.getFunction(mapping.fn!),
                mode = mapping.mode ?? this.mode;

              mapping.emitter
                ? this.getEmitter(mapping.emitter)[mode](event, (this._listeners[event] = fn))
                : this.emitter[mode](event, (this._listeners[event] = fn))
            }

            const fn = this.getFunction(mapping as Fn);
            this._listeners[event] = fn;
            return this.emitter[this.mode](event, fn);
          }

          const fn = this[`on${event.slice(0, 1).toUpperCase() + event.substring(1).toLowerCase()}`];
          this._listeners[event] = fn;
          return this.emitter[this.mode](event, fn);
        }
      });
    } else {
      this.emitter[this.mode](this.event, this.run.bind(this));
    }
  }

  /**
   * Removes the listener from the emitter
   * @since 0.0.0-alpha
   * @private
   */
  public _unListen(): void {
    if (Array.isArray(this.event)) {
      this.event.forEach((event) => {
        if (this.mappings) {
          const mapping = this.mappings[event];
          if (mapping && typeof mapping === "object") {
            return mapping.emitter
              ? this.getEmitter(mapping.emitter).removeListener(event, this._listeners[event])
              : this.emitter.removeListener(event, this._listeners[event]);
          }

          return this.emitter.removeListener(event, this._listeners[event]);
        }
      });
    } else {
      this.emitter.removeListener(this.event, this.run.bind(this));
    }
  }


  private getEmitter(v: string | Emitter): Emitter {
    return typeof v === "string" ? this.store.emitters[v] : v;
  }

  private getFunction(v: string | Fn): Fn {
    return (typeof v !== "string" ? v : this[v]).bind(this);
  }
}