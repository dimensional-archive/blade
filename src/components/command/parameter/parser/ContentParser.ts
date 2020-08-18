import { Tokenizer } from "./Tokenizer";
import { Parser } from "./Parser";
import { TypeBuilder } from "../TypeBuilder";

import type { ParameterOptions } from "../../Command";

export class ContentParser {
  /**
   * Flag keys.
   */
  public flagKeys: string[];

  /**
   * Option flag keys.
   */
  public optionKeys: string[];

  /**
   * Whether or not the content is quoted/has quotes.
   */
  public quoted: boolean;

  /**
   * The argument separator.
   */
  public separator: string;

  /**
   * @param flagKeys
   * @param optionKeys
   * @param quoted
   * @param separator
   */
  public constructor({ flagKeys = [], optionKeys = [], quoted = true, separator }: ContentParserOptions = {}) {
    this.flagKeys = flagKeys.sort((a, b) => b.length - a.length);
    this.optionKeys = optionKeys.sort((a, b) => b.length - a.length);
    this.quoted = Boolean(quoted);
    this.separator = separator!;
  }

  /**
   * Get all flags from command parameters.
   * @param parameters The command parameters.
   * @since 1.0.3
   */
  public static async getFlags(parameters: Dictionary<ParameterOptions>): Promise<FlagResults> {
    const res: FlagResults = {
      flagKeys: [],
      optionKeys: [],
    };

    for (const [ key, arg ] of Object.entries(parameters)) {
      if (typeof arg.type === "function") {
        const type = await arg.type(new TypeBuilder());
        const flag = type.getActions().flag;

        if (flag) flag.option
          ? res.optionKeys.push(`--${key}`, ...flag.aliases ?? [])
          : res.flagKeys.push(`--${key}`, ...flag.aliases ?? []);
      }
    }

    return res;
  }

  /**
   * Parses a string.
   * @param content The content to parse.
   * @since 1.0.3
   */
  public parse(content: string): ContentParserResult {
    const tokens = new Tokenizer(content, {
      flagWords: this.flagKeys,
      optionFlagWords: this.optionKeys,
      quoted: this.quoted,
      separator: this.separator,
    }).tokenize();

    return new Parser(tokens, this.separator != null).parse();
  }
}

export interface ContentParserOptions {
  flagKeys?: string[];
  optionKeys?: string[];
  quoted?: boolean;
  separator?: string;
}

export interface StringData {
  type: "Phrase" | "Flag" | "OptionFlag";
  raw: string;
  key?: string;
  value?: string;
}

export interface ContentParserResult {
  all: StringData[];
  phrases: StringData[];
  flags: StringData[];
  options: StringData[];
}

export interface FlagResults {
  optionKeys: string[];
  flagKeys: string[]
}
