import { Message } from "eris";
export declare class Flag {
    type: string;
    command?: string;
    ignore?: boolean;
    rest?: string;
    message?: Message;
    value?: any;
    constructor(type: string, data?: Record<string, any>);
    static cancel(): Flag;
    static retry(message: Message): Flag;
    static fail(value: any): Flag;
    static continue(command: string, ignore?: boolean, rest?: null): Flag;
    static is(value: any, type: string): boolean;
}
