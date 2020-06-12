import { Emitter, Listener } from "../components/Listener";
import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";

import type { BladeClient } from "../Client";

export interface ListenerStoreOptions extends ComponentStoreOptions {
  emitters?: Record<string, Emitter>;
}

export class ListenerStore extends ComponentStore<Listener> {
  public emitters: Record<string, Emitter>;

  constructor(client: BladeClient, options: ListenerStoreOptions = {}) {
    super(client, "events", {
      classToHandle: Listener,
      ...options
    });

    this.emitters = options.emitters ?? {
      client,
      listeners: this
    }
  }

  /**
   * A wrapper for the super.remove method.
   * @param resolvable The listener to remove.
   */
  public remove(resolvable: ComponentResolvable<Listener>): Listener | null {
    const removed = super.remove(resolvable);
    if (!removed) return null;

    removed._unListen();
    return removed;
  }

  /**
   * A wrapper for the super.add method.
   * @param component The listener to add.
   */
  public add(component: Listener): Listener | null {
    const listener = super.add(component);
    if (!listener) return null;

    listener._listen();
    return listener;
  }
}