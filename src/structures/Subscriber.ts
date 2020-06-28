import { Part, PartOptions } from "./base/Part";
import { Util } from "../util";

import type { SubscriberStore } from "./SubscriberStore";
import type { EventEmitter } from "events";
import { MethodNotImplementedError } from "@ayanaware/errors";

export type Emitter = EventEmitter;
export type SubscriptionType = "once" | "on";

export interface SubscriberOptions extends PartOptions {
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
  mappings?: Record<string, Subscription>;
  /**
   * The listener mode.
   */
  type?: SubscriptionType;
}

export interface Subscription {
  fn?: string;
  type?: SubscriptionType;
}

/**
 * An abstract class for adding a listener to an emitter.
 * @since 1.0.0
 * @extends Part
 */
export class Subscriber extends Part {
  /**
   * The store this listener belongs to.
   */
  public readonly store!: SubscriberStore;

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
  public mappings: Record<string, string | Subscription>;
  /**
   * The mode of the listener, "on" | "off" | "once"
   * @since 1.0.0
   */
  public type: SubscriptionType;
  /**
   * Map of events.
   * @since 1.0.0
   * @private
   */
  private _listeners: Record<string, (...args: any[]) => any> = {};

  public constructor(
    store: SubscriberStore,
    dir: string,
    file: string[],
    options: SubscriberOptions
  ) {
    super(store, dir, file, options);

    const emitter = options.emitter ?? "client";

    this.event = options.event;
    this.emitter =
      typeof emitter === "string" ? store.emitters[emitter] : emitter;
    this.mappings = options.mappings ?? {};
    this.type = options.type ?? "on";
  }

  /**
   * A decorator used for applying subscriber options.
   * @param options The options to use when creating this listener.
   * @constructor
   */
  public static Setup(
    options: SubscriberOptions
  ): <T extends new (...args: any[]) => Part>(t: T) => T {
    return Part.Setup(options);
  }

  /**
   * Runs this Subscriber.
   * @since 1.0.0
   */
  public async run(...args: any[]): Promise<any> {
    throw new MethodNotImplementedError();
  }

  /**
   * Attaches the proper listener to the emitter
   * @since 1.0.0
   * @private
   */
  public _listen(this: Subscriber): void {
    if (Array.isArray(this.event)) {
      this.event.forEach((event) => {
        if (this.mappings) {
          const mapping = this.mappings[event];
          if (mapping) {
            let fn = this.run;
            let mode = this.type;
            if (typeof mapping === "object") {
              if (mapping.type) mode = mapping.type;
              if (mapping.fn) {
                const _fn = this[mapping.fn];
                if (_fn) fn = _fn;
              }
            }

            if (!fn) return;
            this._listeners[event] = fn.bind(this);
            return this.emitter[mode](event, fn.bind(this));
          }

          const fn = this[`on${Util.capitalize(event, false)}`];
          if (!fn) return;
          
          this._listeners[event] = fn.bind(this);
          return this.emitter[this.type](event, fn.bind(this));
        }
      });
    } else {
      this.emitter[this.type](this.event, this.run.bind(this));
    }
  }

  /**
   * Removes the listener from the emitter
   * @since 0.0.0-alpha
   * @private
   */
  public _unListen(): void {
    if (Array.isArray(this.event)) {
      this.event.forEach((event) =>
        this.emitter.removeListener(event, this._listeners[event].bind(this))
      );
    } else {
      this.emitter.removeListener(this.event, this.run.bind(this));
    }
  }
}
