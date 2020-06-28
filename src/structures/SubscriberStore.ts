import { Emitter, Subscriber } from "./Subscriber";
import { ComponentResolvable, Store, StoreOptions } from "./base/Store";

import type { BladeClient } from "../Client";

export interface SubscriberStoreOptions extends StoreOptions {
  emitters?: Record<string, Emitter>;
}

export class SubscriberStore extends Store<Subscriber> {
  public emitters: Record<string, Emitter>;

  constructor(client: BladeClient, options: SubscriberStoreOptions = {}) {
    super(client, "subscribers", {
      classToHandle: Subscriber,
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
  public remove(resolvable: ComponentResolvable<Subscriber>): Subscriber | null {
    const removed = super.remove(resolvable);
    if (!removed) return null;

    removed._unListen();
    return removed;
  }

  /**
   * A wrapper for the super.add method.
   * @param part The listener to add.
   */
  public add(part: Subscriber): Subscriber | null {
    const listener = super.add(part);
    if (!listener) return null;

    listener._listen();
    return listener;
  }
}