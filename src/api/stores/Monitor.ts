import { Monitor } from "../components/Monitor";
import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";
import { LiteEmitter } from "../..";

import type { BladeClient } from "../Client";

/**
 * A monitor store that handles loading of monitors.
 */
export class MonitorStore extends ComponentStore<Monitor> {
  /**
   * The emitter that contains all of the monitor runners.
   * @since 1.0.0
   */
  public emitter: LiteEmitter;

  /**
   * Creates a new Monitor Store
   * @param client The client that is using this command store.
   * @param options The options to give.
   */
  public constructor(client: BladeClient, options: ComponentStoreOptions = {}) {
    super(client, "monitors", {
      ...options,
      classToHandle: Monitor
    });

    this.emitter = new LiteEmitter();
    this.client.on("messageCreate", (m) => this.emitter.emit("message", m));
  }

  /**
   * A wrapper for the super.remove method.
   * @param resolvable
   * @since 1.0.0
   */
  public remove(resolvable: ComponentResolvable<Monitor>): Monitor | null {
    const monitor = super.remove(resolvable);
    if (!monitor) return null;
    this.emitter.removeListener("message", monitor._ran.bind(monitor));
    return monitor;
  }

  /**
   * A wrapper for the super.add method.
   * @param component
   * @since 1.0.0
   */
  public add(component: Monitor): Monitor | null {
    const monitor = super.add(component);
    if (!monitor) return null;
    this.emitter.on("message", component._ran.bind(component));
    return monitor;
  }
}
