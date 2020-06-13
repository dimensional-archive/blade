import { Command } from "../Command";
import { Flag } from "./Flag";
import { ArgumentOptions } from "./Types";
import { ContentParserResult } from "./ContentParser";
import { Context } from "../Context";
import { Message } from "eris";
import { Argument } from "./Argument";
export declare type ArgumentGenerator = (ctx: Context, parsed: ContentParserResult, state: ArgumentRunnerState) => IterableIterator<ArgumentOptions | Flag>;
export interface ArgumentRunnerState {
    usedIndices: Set<number>;
    phraseIndex: number;
    index: number;
}
export declare class ArgumentRunner {
    command: Command;
    constructor(command: Command);
    get client(): import("../../..").BladeClient;
    get handler(): import("../../..").CommandStore;
    run(message: Message, parsed: ContentParserResult, generator: ArgumentGenerator): Promise<any>;
    runOne(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runPhrase(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<any>;
    runRest(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runSeparate(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runFlag(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runOption(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runText(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runContent(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runRestContent(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    runNone(message: Message, parsed: ContentParserResult, state: ArgumentRunnerState, arg: Argument): Promise<Flag | any>;
    static increaseIndex(parsed: ContentParserResult, state: ArgumentRunnerState, n?: number): void;
    static isShortCircuit(value: any): boolean;
    static fromArguments(args: [string, Argument][]): ArgumentGenerator;
}
