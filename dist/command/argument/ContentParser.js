"use strict";
/*
 * Grammar:
 *
 * Arguments
 *  = (Argument (WS? Argument)*)? EOF
 *
 * Argument
 *  = Flag
 *  | Phrase
 *
 * Flag
 *  = FlagWord
 *  | OptionFlagWord WS? Phrase?
 *
 * Phrase
 *  = Quote (Word | WS)* Quote?
 *  | OpenQuote (Word | OpenQuote | Quote | WS)* EndQuote?
 *  | EndQuote
 *  | Word
 *
 * FlagWord = Given
 * OptionFlagWord = Given
 * Quote = "
 * OpenQuote = “
 * EndQuote = ”
 * Word = /^\S+/ (and not in FlagWord or OptionFlagWord)
 * WS = /^\s+/
 * EOF = /^$/
 *
 * With a separator:
 *
 * Arguments
 *  = (Argument (WS? Separator WS? Argument)*)? EOF
 *
 * Argument
 *  = Flag
 *  | Phrase
 *
 * Flag
 *  = FlagWord
 *  | OptionFlagWord WS? Phrase?
 *
 * Phrase
 *  = Word (WS Word)*
 *
 * FlagWord = Given
 * OptionFlagWord = Given
 * Seperator = Given
 * Word = /^\S+/ (and not in FlagWord or OptionFlagWord or equal to Seperator)
 * WS = /^\s+/
 * EOF = /^$/
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _content, _flagWords, _optionFlagWords, _quoted, _separator, _position, _state, _tokens;
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
class Tokenizer {
    constructor(content, { flagWords = [], optionFlagWords = [], quoted = true, separator, } = {}) {
        _content.set(this, void 0);
        _flagWords.set(this, void 0);
        _optionFlagWords.set(this, void 0);
        _quoted.set(this, void 0);
        _separator.set(this, void 0);
        _position.set(this, 0);
        _state.set(this, 0); // 0 -> Default, 1 -> Quotes (""), 2 -> Special Quotes (“”)
        _tokens.set(this, []);
        __classPrivateFieldSet(this, _content, content);
        __classPrivateFieldSet(this, _flagWords, flagWords);
        __classPrivateFieldSet(this, _optionFlagWords, optionFlagWords);
        __classPrivateFieldSet(this, _quoted, quoted);
        __classPrivateFieldSet(this, _separator, separator);
    }
    startsWith(str) {
        return (__classPrivateFieldGet(this, _content).slice(__classPrivateFieldGet(this, _position), __classPrivateFieldGet(this, _position) + str.length)
            .toLowerCase() === str.toLowerCase());
    }
    match(regex) {
        return __classPrivateFieldGet(this, _content).slice(__classPrivateFieldGet(this, _position)).match(regex);
    }
    slice(from, to) {
        return __classPrivateFieldGet(this, _content).slice(__classPrivateFieldGet(this, _position) + from, __classPrivateFieldGet(this, _position) + to);
    }
    addToken(type, value) {
        __classPrivateFieldGet(this, _tokens).push({ type, value });
    }
    advance(n) {
        __classPrivateFieldSet(this, _position, __classPrivateFieldGet(this, _position) + n);
    }
    choice(...actions) {
        for (const action of actions) {
            if (action.call(this)) {
                return;
            }
        }
    }
    tokenize() {
        while (__classPrivateFieldGet(this, _position) < __classPrivateFieldGet(this, _content).length) {
            this.runOne();
        }
        this.addToken("EOF", "");
        return __classPrivateFieldGet(this, _tokens);
    }
    runOne() {
        this.choice(this.runWhitespace, this.runFlags, this.runOptionFlags, this.runQuote, this.runOpenQuote, this.runEndQuote, this.runSeparator, this.runWord);
    }
    runFlags() {
        if (__classPrivateFieldGet(this, _state) === 0) {
            for (const word of __classPrivateFieldGet(this, _flagWords)) {
                if (this.startsWith(word)) {
                    this.addToken("FlagWord", this.slice(0, word.length));
                    this.advance(word.length);
                    return true;
                }
            }
        }
        return false;
    }
    runOptionFlags() {
        if (__classPrivateFieldGet(this, _state) === 0) {
            for (const word of __classPrivateFieldGet(this, _optionFlagWords)) {
                if (this.startsWith(word)) {
                    this.addToken("OptionFlagWord", this.slice(0, word.length));
                    this.advance(word.length);
                    return true;
                }
            }
        }
        return false;
    }
    runQuote() {
        if (__classPrivateFieldGet(this, _separator) == null && __classPrivateFieldGet(this, _quoted) && this.startsWith('"')) {
            if (__classPrivateFieldGet(this, _state) === 1) {
                __classPrivateFieldSet(this, _state, 0);
            }
            else if (__classPrivateFieldGet(this, _state) === 0) {
                __classPrivateFieldSet(this, _state, 1);
            }
            this.addToken("Quote", '"');
            this.advance(1);
            return true;
        }
        return false;
    }
    runOpenQuote() {
        if (__classPrivateFieldGet(this, _separator) == null && __classPrivateFieldGet(this, _quoted) && this.startsWith('"')) {
            if (__classPrivateFieldGet(this, _state) === 0) {
                __classPrivateFieldSet(this, _state, 2);
            }
            this.addToken("OpenQuote", '"');
            this.advance(1);
            return true;
        }
        return false;
    }
    runEndQuote() {
        if (__classPrivateFieldGet(this, _separator) == null && __classPrivateFieldGet(this, _quoted) && this.startsWith("”")) {
            if (__classPrivateFieldGet(this, _state) === 2) {
                __classPrivateFieldSet(this, _state, 0);
            }
            this.addToken("EndQuote", "”");
            this.advance(1);
            return true;
        }
        return false;
    }
    runSeparator() {
        if (__classPrivateFieldGet(this, _separator) != null && this.startsWith(__classPrivateFieldGet(this, _separator))) {
            this.addToken("Separator", this.slice(0, __classPrivateFieldGet(this, _separator).length));
            this.advance(__classPrivateFieldGet(this, _separator).length);
            return true;
        }
        return false;
    }
    runWord() {
        const wordRegex = __classPrivateFieldGet(this, _state) === 0 ? /^\S+/ : __classPrivateFieldGet(this, _state) === 1 ? /^[^\s"]+/ : /^[^\s”]+/;
        const wordMatch = this.match(wordRegex);
        if (wordMatch) {
            if (__classPrivateFieldGet(this, _separator)) {
                if (wordMatch[0].toLowerCase() === __classPrivateFieldGet(this, _separator).toLowerCase()) {
                    return false;
                }
                const index = wordMatch[0].indexOf(__classPrivateFieldGet(this, _separator));
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
    runWhitespace() {
        const wsMatch = this.match(/^\s+/);
        if (wsMatch) {
            this.addToken("WS", wsMatch[0]);
            this.advance(wsMatch[0].length);
            return true;
        }
        return false;
    }
}
_content = new WeakMap(), _flagWords = new WeakMap(), _optionFlagWords = new WeakMap(), _quoted = new WeakMap(), _separator = new WeakMap(), _position = new WeakMap(), _state = new WeakMap(), _tokens = new WeakMap();
class Parser {
    constructor(tokens, { separated }) {
        this.tokens = tokens;
        this.position = 0;
        /*
         * Phrases are `{ type: 'Phrase', value, raw }`.
         * Flags are `{ type: 'Flag', key, raw }`.
         * Option flags are `{ type: 'OptionFlag', key, value, raw }`.
         * The `all` property is partitioned into `phrases`, `flags`, and `optionFlags`.
         */
        this.results = {
            all: [],
            phrases: [],
            flags: [],
            optionFlags: [],
        };
        this.separated = separated;
    }
    next() {
        this.position++;
    }
    lookaheadN(n, ...types) {
        return (this.tokens[this.position + n] != null &&
            types.includes(this.tokens[this.position + n].type));
    }
    lookahead(...types) {
        return this.lookaheadN(0, ...types);
    }
    match(...types) {
        if (this.lookahead(...types)) {
            this.next();
            return this.tokens[this.position - 1];
        }
        throw new Error(`Unexpected token ${this.tokens[this.position].value} of type ${this.tokens[this.position].type} (this should never happen)`);
    }
    parse() {
        // -1 for EOF.
        while (this.position < this.tokens.length - 1) {
            this.runArgument();
        }
        this.match("EOF");
        return this.results;
    }
    runArgument() {
        const leading = this.lookahead("WS") ? this.match("WS").value : "";
        if (this.lookahead("FlagWord", "OptionFlagWord")) {
            const parsed = this.parseFlag();
            const trailing = this.lookahead("WS") ? this.match("WS").value : "";
            const separator = this.lookahead("Separator")
                ? this.match("Separator").value
                : "";
            parsed.raw = `${leading}${parsed.raw}${trailing}${separator}`;
            this.results.all.push(parsed);
            if (parsed.type === "Flag")
                this.results.flags.push(parsed);
            else
                this.results.optionFlags.push(parsed);
            return;
        }
        const parsed = this.parsePhrase(), trailing = this.lookahead("WS") ? this.match("WS").value : "", separator = this.lookahead("Separator")
            ? this.match("Separator").value
            : "";
        parsed.raw = `${leading}${parsed.raw}${trailing}${separator}`;
        this.results.all.push(parsed);
        this.results.phrases.push(parsed);
    }
    parseFlag() {
        if (this.lookahead("FlagWord")) {
            const flag = this.match("FlagWord");
            return { type: "Flag", key: flag.value, raw: flag.value };
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
        if (ws != null) {
            parsed.raw += ws.value;
        }
        const phrase = this.lookahead("Quote", "OpenQuote", "EndQuote", "Word")
            ? this.parsePhrase()
            : null;
        if (phrase != null) {
            parsed.value = phrase.value;
            parsed.raw += phrase.raw;
        }
        return parsed;
    }
    parsePhrase() {
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
                if (endQuote != null) {
                    parsed.raw += endQuote.value;
                }
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
                    }
                    else {
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
}
class ContentParser {
    constructor({ flagWords = [], optionFlagWords = [], quoted = true, separator } = {}) {
        this.flagWords = flagWords;
        this.flagWords.sort((a, b) => b.length - a.length);
        this.optionFlagWords = optionFlagWords;
        this.optionFlagWords.sort((a, b) => b.length - a.length);
        this.quoted = Boolean(quoted);
        this.separator = separator;
    }
    static getFlags(args) {
        const res = {
            flagWords: [],
            optionFlagWords: [],
        };
        for (const arg of args) {
            const arr = res[arg.match === __1.ArgumentMatches.FLAG ? "flagWords" : "optionFlagWords"];
            if (arg.match === __1.ArgumentMatches.FLAG ||
                arg.match === __1.ArgumentMatches.OPTION) {
                if (Array.isArray(arg.flag)) {
                    arr.push(...arg.flag);
                }
                else {
                    arr.push(arg.flag);
                }
            }
        }
        return res;
    }
    parse(content) {
        const tokens = new Tokenizer(content, {
            flagWords: this.flagWords,
            optionFlagWords: this.optionFlagWords,
            quoted: this.quoted,
            separator: this.separator,
        }).tokenize();
        return new Parser(tokens, { separated: this.separator != null }).parse();
    }
}
exports.ContentParser = ContentParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGVudFBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kL2FyZ3VtZW50L0NvbnRlbnRQYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtREc7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHSCw2QkFBd0M7QUFleEMsTUFBTSxTQUFTO0lBV2IsWUFDRSxPQUFlLEVBQ2YsRUFDRSxTQUFTLEdBQUcsRUFBRSxFQUNkLGVBQWUsR0FBRyxFQUFFLEVBQ3BCLE1BQU0sR0FBRyxJQUFJLEVBQ2IsU0FBUyxNQUNRLEVBQW1CO1FBakJ4QywyQkFBYztRQUNkLDZCQUFxQjtRQUNyQixtQ0FBMkI7UUFDM0IsMEJBQWlCO1FBQ2pCLDZCQUFtQjtRQUVuQixvQkFBWSxDQUFDLEVBQUM7UUFDZCxpQkFBUyxDQUFDLEVBQUMsQ0FBQywyREFBMkQ7UUFDdkUsa0JBQW1CLEVBQUUsRUFBQztRQVdwQix1QkFBQSxJQUFJLFlBQVksT0FBTyxFQUFDO1FBQ3hCLHVCQUFBLElBQUksY0FBYyxTQUFTLEVBQUM7UUFDNUIsdUJBQUEsSUFBSSxvQkFBb0IsZUFBZSxFQUFDO1FBQ3hDLHVCQUFBLElBQUksV0FBVyxNQUFNLEVBQUM7UUFDdEIsdUJBQUEsSUFBSSxjQUFjLFNBQVMsRUFBQztJQUM5QixDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQVc7UUFDM0IsT0FBTyxDQUNMLHVDQUNHLEtBQUssMENBQWlCLDBDQUFpQixHQUFHLENBQUMsTUFBTSxDQUFDO2FBQ2xELFdBQVcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FDdkMsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBYTtRQUN4QixPQUFPLHVDQUFjLEtBQUsseUNBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxL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