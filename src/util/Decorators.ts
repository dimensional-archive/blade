import { Logger } from "@melike2d/logger";

/**
 * Creates a new logger with a provided name.
 * @param name The logger name.
 * @since 1.0.0
 */
export function logger(name: string | any): PropertyDecorator
/**
 * Creates a new logger with a random name.
 * @since 1.0.0
 */
export function logger(target: any, propertyKey: PropertyKey): void
export function logger(nameOrTarget: string | any, propertyKey?: PropertyKey): PropertyDecorator | void {
  if (typeof nameOrTarget === "string" || !propertyKey) {
    const name = typeof nameOrTarget === "string"
      ? nameOrTarget
      : nameOrTarget.name;

    return (target, key) => {
      Object.defineProperty(target, key, { value: new Logger(name) });
    };
  }

  Object.defineProperty(nameOrTarget, propertyKey, {
    value: new Logger(Math.random().toString(32).substr(0, 8))
  });
}
