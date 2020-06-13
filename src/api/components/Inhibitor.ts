import { Component, ComponentOptions } from "./Base";

import type { InhibitorStore } from "../stores/Inhibitor";
import { Message } from "eris";
import { Command } from "./command/Command";

export type InhibitorType = "all" | "pre" | "post" | "command";

export interface InhibitorOptions extends ComponentOptions {
  /**
   * The type of inhibitor.
   * Can be 'all' to run on all messages, 'pre' to run on messages not blocked by the built-in inhibitors, or 'post' to run on messages that are commands, or 'command' to be ran on certain commands.
   */
  type?: InhibitorType;
  /**
   * Reason emitted when command or message is blocked.
   * @default Inhibitor Name.
   */
  reason?: string;
  /**
   * Priority for the inhibitor for when more than one inhibitors block a message.
   */
  priority?: number;
}

/**
 * A message inhibitor.
 * @since 1.0.0
 */
export class Inhibitor extends Component {
  /**
   * The type of inhibitor.
   * @since 1.0.0
   */
  public type: InhibitorType;
  /**
   * Reason emitted when command or message is blocked.
   * @since 1.0.0
   */
  public reason: string;
  /**
   * Priority for the inhibitor for when more than one inhibitors block a message.
   * @since 1.0.0
   */
  public priority: number;

  /**
   * Creates a new Inhibitor.
   * @param store The store this inhibitor belongs to
   * @param dir The directory this inhibitor is in.
   * @param path The file path this inhibitor.
   * @param options The options to give this inhibitor.
   */
  public constructor(store: InhibitorStore, dir: string, path: string[], options: InhibitorOptions = {}) {
    super(store, dir, path, options);

    this.type = options.type ?? "pre";
    this.reason = options.reason ?? this.name;
    this.priority = options.priority ?? 0;
  }

  public run(...args: any[]): boolean | Promise<boolean> {
    return false;
  }
}