
import type { EventIterator } from '@klasa/event-iterator';
import { Collection } from "../Storage";
import { Base } from "eris";

/**
 * The base structure collector for asynchronously collecting values.
 * @since 0.0.1
 */
export class Collector<T extends Base, R extends [T, ...unknown[]], I extends EventIterator<R>> {

  /**
   * The collected values.
   * @since 0.0.1
   */
  protected collected = new Collection<string, T>();

  /**
   * The event iterator that's yielding values.
   * @since 0.0.1
   */
  readonly #iterator: I;

  /**
   * Creates a new Collector.
   * @param iterator The EventIterator that is yielding values.
   * @since 1.0.0
   */
  public constructor(iterator: I) {
    this.#iterator = iterator;
  }

  /**
   * Collect's the values into the Collector's cache.
   * @since 1.0.0
   */
  public async collect(): Promise<Collection<string, T>> {
    for await (const [struct] of this.#iterator) this.collected.set(struct.id, struct);
    return this.collected;
  }
}
