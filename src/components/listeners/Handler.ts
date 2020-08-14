import { blade } from "../../util";
import { Listener } from "./Listener";

import type { EventEmitter } from "events";
import type { BladeClient } from "../../Client";
import type { ModuleResolvable } from "../base/Module";

export class ListenerHandler extends blade.get("Handler")<Listener> {
  /**
   * Emitters to use for listeners.
   */
  public emitters: Dictionary<EventEmitter>;

  /**
   * @param client
   * @param options
   */
  public constructor(client: BladeClient, options: ListenerHandlerOptions) {
    super(client, "listeners", {
      ...options,
      class: Listener
    });

    this.emitters = options.emitters ?? { client, listeners: this };
  }

  /**
   * Adds a new listener to this handler.
   * @param module The listener to add.
   * @param reload Whether or not the listener was reloaded.
   * @since 1.0.0
   */
  public add(module: Listener, reload = false): Listener | null {
    const listener = super.add(module, reload);
    if (listener) return listener._unListen()._listen();
    return null;
  }

  /**
   * Removes a listener from this handler.
   * @param resolvable The listener to remove.
   * @since 1.0.0
   */
  public remove(resolvable: ModuleResolvable<Listener>): Listener | null {
    const listener = super.remove(resolvable);
    if (listener) return listener._unListen();
    return null;
  }
}

export interface ListenerHandlerOptions {
  emitters?: Dictionary<EventEmitter>;
}
