import { Monitor } from "../components/Monitor";
import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";
import { LiteEmitter } from "../..";
import type { BladeClient } from "../Client";
/**
 * A monitor store that handles loading of monitors.
 */
export declare class MonitorStore extends ComponentStore<Monitor> {
    /**
     * The emitter that contains all of the monitor runners.
     * @since 1.0.0
     */
    emitter: LiteEmitter;
    /**
     * Creates a new Monitor Store
     * @param client The client that is using this command store.
     * @param options The options to give.
     */
    constructor(client: BladeClient, options?: ComponentStoreOptions);
    /**
     * A wrapper for the super.remove method.
     * @param resolvable
     * @since 1.0.0
     */
    remove(resolvable: ComponentResolvable<Monitor>): Monitor | null;
    /**
     * A wrapper for the super.add method.
     * @param component
     * @since 1.0.0
     */
    add(component: Monitor): Monitor | null;
}
