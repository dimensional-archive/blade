import { ComponentStore, ComponentStoreOptions } from "./Base";
import { Inhibitor, InhibitorType } from "../components/Inhibitor";
import type { BladeClient } from "../Client";
import { Message } from "eris";
import { Command } from "../..";
export declare class InhibitorStore extends ComponentStore<Inhibitor> {
    constructor(client: BladeClient, options?: ComponentStoreOptions);
    /**
     * Tests inhibitors against the message.
     * @param type The type of inhibitors to test.
     * @param message Message to test.
     * @param command Command to use.
     */
    test(type: InhibitorType, message: Message, command?: Command): Promise<string | null>;
}
