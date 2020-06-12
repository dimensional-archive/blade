import { Component } from "./Base";
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