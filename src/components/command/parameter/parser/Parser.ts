import type { Token, TokenType } from "./Tokenizer";

export class Parser {
  /**
   * Whether or not ***separated***
   */
  public separated: boolean;

  /**
   * The position.
   */
  public position: number;

  /**
   * The parser results.
   */
  public results: ParserResults;

  /**
   * @param tokens
   * @param separated
   */
  public constructor(public tokens: Token[], separated = false) {
    this.separated = separated;
    this.position = 0;
    this.results = {
      all: [],
      phrases: [],
      flags: [],
      options: [],
    };
  }

  /**
   * Parses the tokens.
   */
  public parse(): ParserResults {
    while (this.position < this.tokens.length - 1) this.runArgument();
    this.match("EOF");
    return this.results;
  }

  /**
   * Runs an argument
   */
  private runArgument() {
    const leading = this.lookahead("WS")
      ? this.match("WS").value
      : "";

    if (this.lookahead("FlagWord", "OptionFlagWord")) {
      const parsed = this.parseFlag();

      const trailing = this.lookahead("WS")
        ? this.match("WS").value
        : "";

      const separator = this.lookahead("Separator")
        ? this.match("Separator").value
        : "";

      parsed.raw = `${leading}${parsed.raw}${trailing}${separator}`;
      this.results.all.push(parsed);

      parsed.type === "Flag"
        ? this.results.flags.push(parsed)
        : this.results.options.push(parsed);

      return;
    }

    const parsed = this.parsePhrase(),
      trailing = this.lookahead("WS") ? this.match("WS").value : "",
      separator = this.lookahead("Separator")
        ? this.match("Separator").value
        : "";

    parsed.raw = `${leading}${parsed.raw}${trailing}${separator}`;

    this.results.all.push(parsed);
    this.results.phrases.push(parsed);
  }

  /**
   * Parses a flag.
   */
  private parseFlag() {
    if (this.lookahead("FlagWord")) {
      const flag = this.match("FlagWord");
      return {
        type: "Flag",
        key: flag.value,
        raw: flag.value
      };
    }

    // Otherwise, `this.lookahead('OptionFlagWord')` should be true.
    const flag = this.match("OptionFlagWord");
    const parsed = {
      type: "OptionFlag",
      key: flag.value,
      value: "",
      raw: flag.value,
    };

    const ws = this.lookahead("WS") ? this.match("WS") : null;
    if (ws != null) parsed.raw += ws.value;

    const phrase = this.lookahead("Quote", "OpenQuote", "EndQuote", "Word")
      ? this.parsePhrase()
      : null;

    if (phrase != null) {
      parsed.value = phrase.value;
      parsed.raw += phrase.raw;
    }

    return parsed;
  }

  /**
   * Parses a phrase.
   */
  private parsePhrase() {
    if (!this.separated) {
      if (this.lookahead("Quote")) {
        const parsed = { type: "Phrase", value: "", raw: "" };
        const openQuote = this.match("Quote");
        parsed.raw += openQuote.value;

        while (this.lookahead("Word", "WS")) {
          const match = this.match("Word", "WS");
          parsed.value += match.value;
          parsed.raw += match.value;
        }

        const endQuote = this.lookahead("Quote") ? this.match("Quote") : null;
        if (endQuote != null) parsed.raw += endQuote.value;

        return parsed;
      }

      if (this.lookahead("OpenQuote")) {
        const parsed = { type: "Phrase", value: "", raw: "" };
        const openQuote = this.match("OpenQuote");
        parsed.raw += openQuote.value;
        while (this.lookahead("Word", "WS")) {
          const match = this.match("Word", "WS");
          if (match.type === "Word") {
            parsed.value += match.value;
            parsed.raw += match.value;
          } else {
            parsed.raw += match.value;
          }
        }

        const endQuote = this.lookahead("EndQuote")
          ? this.match("EndQuote")
          : null;
        if (endQuote != null) {
          parsed.raw += endQuote.value;
        }

        return parsed;
      }

      if (this.lookahead("EndQuote")) {
        const endQuote = this.match("EndQuote");
        return {
          type: "Phrase",
          value: endQuote.value,
          raw: endQuote.value,
        };
      }
    }

    if (this.separated) {
      const init = this.match("Word");
      const parsed = { type: "Phrase", value: init.value, raw: init.value };

      while (this.lookahead("WS") && this.lookaheadN(1, "Word")) {
        const ws = this.match("WS");
        const word = this.match("Word");
        parsed.value += ws.value + word.value;
      }

      parsed.raw = parsed.value;
      return parsed;
    }

    const word = this.match("Word");
    return { type: "Phrase", value: word.value, raw: word.value };
  }

  /**
   * Matches type(s).
   * @param types
   * @since 1.0.0
   */
  private match(...types: TokenType[]) {
    if (this.lookahead(...types)) {
      this.next();
      return this.tokens[this.position - 1];
    }

    throw new Error(
      `Unexpected token ${this.tokens[this.position].value} of type ${
        this.tokens[this.position].type
      } (this should never happen)`
    );
  }

  /**
   * Advances the parser position.
   * @since 1.0.0
   */
  private next() {
    this.position++;
  }

  private lookaheadN(n: number, ...types: TokenType[]) {
    return (
      this.tokens[this.position + n] != null &&
      types.includes(this.tokens[this.position + n].type)
    );
  }

  private lookahead(...types: TokenType[]) {
    return this.lookaheadN(0, ...types);
  }
}

export interface ParserResults {
  all: any[];
  phrases: any[];
  flags: any[];
  options: any[];
}
