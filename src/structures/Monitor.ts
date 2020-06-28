import { Part, PartOptions } from "./base/Part";
import { MethodNotImplementedError } from "@ayanaware/errors";

import type { MonitorStore } from "./MonitorStore";
import type { Message } from "eris";

export class Monitor extends Part {
  /**
   * The monitor store that stores this part.
   * @since 1.0.0
   */
  public readonly store!: MonitorStore;

  /**
   * A typescript helper decorator.
   * @param options The options to use when creating this listener.
   * @constructor
   */
  public static Setup(options: PartOptions): <T extends new (...args: any[]) => Part>(t: T) => T {
    return Part.Setup(options);
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