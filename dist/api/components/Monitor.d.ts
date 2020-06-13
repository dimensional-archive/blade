import { Component, ComponentOptions } from "./Base";
import type { MonitorStore } from "../stores/Monitor";
import type { Message } from "eris";
export declare class Monitor extends Component {
    /**
     * The monitor store that stores this component.
     * @since 1.0.0
     */
    readonly store: MonitorStore;
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options: ComponentOptions): <T extends new (...args: any[]) => Component>(t: T) => T;
    /**
     * Runs this monitor
     * @param message
     */
    run(message: Message): Promise<void>;
    _ran(message: Message): Promise<void>;
}
