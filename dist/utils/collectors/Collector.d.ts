import type { EventIterator } from '@klasa/event-iterator';
import { Storage } from "../Storage";
import { Base } from "eris";
/**
 * The base structure collector for asynchronously collecting values.
 * @since 0.0.1
 */
export declare class Collector<T extends Base, R extends [T, ...unknown[]], I extends EventIterator<R>> {
    #private;
    /**
     * The collected values.
     * @since 0.0.1
     */
    protected collected: Storage<string, T>;
    /**
     * Creates a new Collector.
     * @param iterator The EventIterator that is yielding values.
     * @since 1.0.0
     */
    constructor(iterator: I);
    /**
     * Collect's the values into the Collector's cache.
     * @since 1.0.0
     */
    collect(): Promise<Storage<string, T>>;
}
