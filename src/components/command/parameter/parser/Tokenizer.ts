import type { Fn } from "@kyudiscord/neo";

export class Tokenizer {
  /**
   * Flag words.
   */
  public readonly flagWords: string[];

  /**
   * Option flag words
   */
  public readonly optionFlags: string[];

  /**
   * Whether or not the content is quoted/has quotes.
   */
  public readonly quoted: boolean;

  /**
   * The separator.
   */
  public readonly separator: string;

  /**
   * The provided content.
   */
  public readonly content: string;

  /**
   * The position of the tokenizer.
   */
  #position = 0;

  /**
   * The state of the tokenizer.
   */
  #state = 0; // 0 -> Default, 1 -> Quotes (""), 2 -> Special Quotes (“”)

  /**
   * All tokens.
   */
  #tokens: Token[] = [];

  public constructor(
    content: string,
    {
      flagWords = [],
      optionFlagWords = [],
      quoted = true,
      separator,
    }: TokenizerData = {} as TokenizerData
  ) {
    this.content = content;
    this.flagWords = flagWords;
    this.optionFlags = optionFlagWords;
    this.quoted = quoted;
    this.separator = separator;
  }

  /**
   * @param str
   */
  public startsWith(str: string): boolean {
    return (
      this.content
        .slice(this.#position, this.#position + str.length)
        .toLowerCase() === str.toLowerCase()
    );
  }

  /**
   * @param regex
   */
  public match(regex: RegExp): RegExpMatchArray | null {
    return this.content.slice(this.#position).match(regex);
  }

  /**
   * @param from
   * @param to
   */
  public slice(from: number, to: number): string {
    return this.content.slice(this.#position + from, this.#position + to);
  }

  /**
   * @param type
   * @param value
   */
  public addToken(type: TokenType, value: string): void {
    this.#tokens.push({ type, value });
  }

  /**
   * Advances the tokenizer position.
   * @param n
   */
  public advance(n: number): void {
    this.#position += n;
  }

  /**
   * @param actions
   */
  public choice(...actions: Fn[]): void {
    for (const action of actions) {
      if (action.call(this)) {
        return;
      }
    }
  }

  /**
   * Tokenize's content.
   */
  public tokenize(): Token[] {
    while (this.#position < this.content.length) {
      this.runOne();
    }

    this.addToken("EOF", "");
    return this.#tokens;
  }

  /**
   * Runs once.
   */
  public runOne(): void {
    this.choice(
      this.runWhitespace,
      this.runFlags,
      this.runOptionFlags,
      this.runQuote,
      this.runOpenQuote,
      this.runEndQuote,
      this.runSeparator,
      this.runWord
    );
  }

  /**
   * Runs a flag.
   */
  public runFlags(): boolean {
    if (this.#state === 0) {
      for (const word of this.flagWords) {
        if (this.startsWith(word)) {
          this.addToken("FlagWord", this.slice(0, word.length));
          this.advance(word.length);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Runs an option flags.
   */
  public runOptionFlags(): boolean {
    if (this.#state === 0) {
      for (const word of this.optionFlags) {
        if (this.startsWith(word)) {
          this.addToken("OptionFlagWord", this.slice(0, word.length));
          this.advance(word.length);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Runs a quote.
   */
  public runQuote(): boolean {
    if (this.separator == null && this.quoted && this.startsWith("\"")) {
      if (this.#state === 1) {
        this.#state = 0;
      } else if (this.#state === 0) {
        this.#state = 1;
      }

      this.addToken("Quote", "\"");
      this.advance(1);
      return true;
    }

    return false;
  }

  /**
   * Runs an open quote.
   */
  public runOpenQuote(): boolean {
    if (this.separator == null && this.quoted && this.startsWith("\"")) {
      if (this.#state === 0) {
        this.#state = 2;
      }

      this.addToken("OpenQuote", "\"");
      this.advance(1);
      return true;
    }

    return false;
  }

  /**
   * Runs an end quote.
   */
  public runEndQuote(): boolean {
    if (this.separator == null && this.quoted && this.startsWith("”")) {
      if (this.#state === 2) {
        this.#state = 0;
      }

      this.addToken("EndQuote", "”");
      this.advance(1);
      return true;
    }

    return false;
  }

  /**
   * Runs the separator.
   */
  public runSeparator(): boolean {
    if (this.separator != null && this.startsWith(this.separator)) {
      this.addToken("Separator", this.slice(0, this.separator.length));
      this.advance(this.separator.length);
      return true;
    }

    return false;
  }

  public runWord(): boolean {
    const wordRegex =
      this.#state === 0 ? /^\S+/ : this.#state === 1 ? /^[^\s"]+/ : /^[^\s”]+/;

    const wordMatch = this.match(wordRegex);
    if (wordMatch) {
      if (this.separator) {
        if (wordMatch[0].toLowerCase() === this.separator.toLowerCase()) {
          return false;
        }

        const index = wordMatch[0].indexOf(this.separator);
        if (index === -1) {
          this.addToken("Word", wordMatch[0]);
          this.advance(wordMatch[0].length);
          return true;
        }

        const actual = wordMatch[0].slice(0, index);
        this.addToken("Word", actual);
        this.advance(actual.length);
        return true;
      }

      this.addToken("Word", wordMatch[0]);
      this.advance(wordMatch[0].length);
      return true;
    }

    return false;
  }

  /**
   * Runs whitespace
   */
  public runWhitespace(): boolean {
    const wsMatch = this.match(/^\s+/);
    if (wsMatch) {
      this.addToken("WS", wsMatch[0]);
      this.advance(wsMatch[0].length);
      return true;
    }

    return false;
  }
}

export type TokenType =
  "WS"
  | "Word"
  | "Separator"
  | "OpenQuote"
  | "EndQuote"
  | "FlagWord"
  | "Quote"
  | "OptionFlagWord"
  | "EOF"

export type Token = {
  type: TokenType;
  value: string;
};

export interface TokenizerData {
  flagWords: string[];
  optionFlagWords: string[];
  quoted: boolean;
  separator: string;
}
