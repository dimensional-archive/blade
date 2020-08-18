import type { Constructor } from "@kyudiscord/neo";
import type { Command, CommandOptions } from "./command/Command";
import type { Listener, ListenerOptions } from "./listener/Listener";
import type { ModuleOptions } from "./base/Module";
import type { Monitor } from "./monitor/Monitor";

/**
 * A helper decorator for applying options to a command.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function command(options: CommandOptions) {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

/**
 * A helper decorator for applying options to a listener.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function listener(options: ListenerOptions) {
  return <T extends new (...args: any[]) => Listener>(target:T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

/**
 * A helper decorator for applying options to a monitor.
 * @param options The options to apply.
 * @since 2.0.0
 */
export function monitor(options: ModuleOptions = {}) {
  return <T extends new (...args: any[]) => Monitor>(target:T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args, options);
      }
    };
  };
}

export type Decorator<M> = (target: Constructor<M>) => Constructor<M>
