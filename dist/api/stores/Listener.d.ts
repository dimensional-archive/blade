import { Emitter, Listener } from "../components/Listener";
import { ComponentResolvable, ComponentStore, ComponentStoreOptions } from "./Base";
import type { BladeClient } from "../Client";
export interface ListenerStoreOptions extends ComponentStoreOptions {
    emitters?: Record<string, Emitter>;
}
export declare class ListenerStore extends ComponentStore<Listener> {
    emitters: Record<string, Emitter>;
    constructor(client: BladeClient, options?: ListenerStoreOptions);
    /**
     * A wrapper for the super.remove method.
     * @param resolvable The listener to remove.
     */
    remove(resolvable: ComponentResolvable<Listener>): Listener | null;
    /**
     * A wrapper for the super.add method.
     * @param component The listener to add.
     */
    add(component: Listener): Listener | null;
}
