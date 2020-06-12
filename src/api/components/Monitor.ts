import { Component, ComponentOptions } from "./Base";
import { MethodNotImplementedError } from "@ayanaware/errors";

import type { MonitorStore } from "../stores/Monitor";
import type { Message } from "eris";

export class Monitor extends Component {
  /**
   * The monitor store that stores this component.
   * @since 1.0.0
   */
  public readonly store!: MonitorStore;

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this listener.
   * @constructor
   */
  public static Setup(options: ComponentOptions): <T extends new (...args: any[]) => Component>(t: T) => T {
    return Component.Setup(options);
  }

  /**
   * Runs this monitor
   * @param message
   */
  public async run(message: Message): Promise<void> {
    throw new MethodNotImplementedError();
  }

  async _ran(message: Message): Promise<void> {
    try {
      this.store.emit("started", this, message);
      await this.run(message);
      this.store.emit("ran", this, message);
    } catch (e) {
      this.store.emit("error", this, e);
    }
  }
}