import { ArgumentTypeCaster } from "./Types";
import { BladeClient, CommandStore, InhibitorStore, ListenerStore, MonitorStore, Storage } from "../../../..";
export declare class TypeResolver {
    handler: CommandStore;
    client: BladeClient;
    types: Storage<string, ArgumentTypeCaster>;
    commands: CommandStore;
    inhibitors: InhibitorStore | null;
    listeners: ListenerStore | null;
    monitors: MonitorStore | null;
    constructor(handler: CommandStore);
    addBuiltInTypes(): void;
    type(name: string): ArgumentTypeCaster;
    addType(name: string, fn: ArgumentTypeCaster): TypeResolver;
    addTypes(types: Record<string, ArgumentTypeCaster>): TypeResolver;
}
