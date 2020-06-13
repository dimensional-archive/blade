import { ArgumentOptions } from "./Types";
export interface ContentParserOptions {
    flagWords?: string[];
    optionFlagWords?: string[];
    quoted?: boolean;
    separator?: string;
}
export interface StringData {
    type: "Phrase" | "Flag" | "OptionFlag";
    raw: string;
    key?: string;
    value?: string;
}
export interface ExtractedFlags {
    flagWords: string[];
    optionFlagWords: string[];
}
export interface ContentParserResult {
    all: StringData[];
    phrases: StringData[];
    flags: StringData[];
    optionFlags: StringData[];
}
export declare class ContentParser {
    flagWords: string[];
    optionFlagWords: string[];
    quoted: boolean;
    separator: string;
    constructor({ flagWords, optionFlagWords, quoted, separator }?: ContentParserOptions);
    static getFlags(args: ArgumentOptions[]): Record<string, string[]>;
    parse(content: string): ContentParserResult;
}
