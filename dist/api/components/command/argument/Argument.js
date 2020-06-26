"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../../../utils/Constants");
const __1 = require("../../../..");
const Flag_1 = require("./Flag");
const Components_1 = require("../../../Components");
class Argument {
    constructor(command, { match = Constants_1.ArgumentMatches.PHRASE, type = Constants_1.ArgumentTypes.STRING, flag, multipleFlags = false, index, unordered = false, limit = Infinity, prompt, default: defaultValue = null, otherwise, modifyOtherwise, } = {}) {
        this.command = command;
        this.match = match;
        this.type = typeof type === "function" ? type.bind(this) : type;
        this.flag = flag;
        this.multipleFlags = multipleFlags;
        this.index = index;
        this.unordered = unordered;
        this.limit = limit;
        this.prompt = prompt;
        this.default =
            typeof defaultValue === "function"
                ? defaultValue.bind(this)
                : defaultValue;
        this.otherwise =
            typeof otherwise === "function" ? otherwise.bind(this) : otherwise;
        this.modifyOtherwise = modifyOtherwise;
    }
    get client() {
        return this.command.client;
    }
    get handler() {
        return this.command.store;
    }
    static async cast(type, resolver, message, phrase) {
        if (Array.isArray(type)) {
            for (const entry of type) {
                if (Array.isArray(entry)) {
                    if (entry.some((t) => t.toLowerCase() === phrase.toLowerCase())) {
                        return entry[0];
                    }
                }
                else if (entry.toLowerCase() === phrase.toLowerCase()) {
                    return entry;
                }
            }
            return null;
        }
        if (typeof type === "function") {
            let res = type(message, phrase);
            if (__1.Util.isPromise(res))
                res = await res;
            return res;
        }
        if (type instanceof RegExp) {
            const match = phrase.match(type);
            if (!match)
                return null;
            const matches = [];
            if (type.global) {
                let matched;
                while ((matched = type.exec(phrase)) != null) {
                    matches.push(matched);
                }
            }
            return { match, matches };
        }
        if (resolver.type(type)) {
            let res = resolver.type(type).call(this, message, phrase);
            if (__1.Util.isPromise(res))
                res = await res;
            return res;
        }
        return phrase || null;
    }
    static union(...types) {
        return async function typeFn(message, phrase) {
            for (let entry of types) {
                if (typeof entry === "function")
                    entry = entry.bind(this);
                const res = await Argument.cast(entry, this.handler.types, message, phrase);
                if (!Argument.isFailure(res))
                    return res;
            }
            return null;
        };
    }
    static product(...types) {
        return async function typeFn(message, phrase) {
            const results = [];
            for (let entry of types) {
                if (typeof entry === "function")
                    entry = entry.bind(this);
                const res = await Argument.cast(entry, this.handler.types, message, phrase);
                if (Argument.isFailure(res))
                    return res;
                results.push(res);
            }
            return results;
        };
    }
    static validate(type, predicate) {
        return async function typeFn(message, phrase) {
            if (typeof type === "function")
                type = type.bind(this);
            const res = await Argument.cast(type, this.handler.types, message, phrase);
            if (Argument.isFailure(res))
                return res;
            if (!predicate.call(this, message, phrase, res))
                return null;
            return res;
        };
    }
    static range(type, min, max, inclusive = false) {
        return Argument.validate(type, (_, p, x) => {
            const o = typeof x === "number" || typeof x === "bigint"
                ? x
                : x.length != null
                    ? x.length
                    : x.size != null
                        ? x.size
                        : x;
            return o >= min && (inclusive ? o <= max : o < max);
        });
    }
    static compose(...types) {
        return async function typeFn(message, phrase) {
            let acc = phrase;
            for (let entry of types) {
                if (typeof entry === "function")
                    entry = entry.bind(this);
                acc = await Argument.cast(entry, this.handler.types, message, acc);
                if (Argument.isFailure(acc))
                    return acc;
            }
            return acc;
        };
    }
    static composeWithFailure(...types) {
        return async function typeFn(message, phrase) {
            let acc = phrase;
            for (let entry of types) {
                if (typeof entry === "function")
                    entry = entry.bind(this);
                acc = await Argument.cast(entry, this.handler.types, message, acc);
            }
            return acc;
        };
    }
    static withInput(type) {
        return async function typeFn(message, phrase) {
            if (typeof type === "function")
                type = type.bind(this);
            const res = await Argument.cast(type, this.handler.types, message, phrase);
            if (Argument.isFailure(res)) {
                return Flag_1.Flag.fail({ input: phrase, value: res });
            }
            return { input: phrase, value: res };
        };
    }
    static tagged(type, tag = type) {
        return async function typeFn(message, phrase) {
            if (typeof type === "function")
                type = type.bind(this);
            const res = await Argument.cast(type, this.handler.types, message, phrase);
            if (Argument.isFailure(res)) {
                return Flag_1.Flag.fail({ tag, value: res });
            }
            return { tag, value: res };
        };
    }
    static taggedWithInput(type, tag = type) {
        return async function typeFn(message, phrase) {
            if (typeof type === "function")
                type = type.bind(this);
            const res = await Argument.cast(type, this.handler.types, message, phrase);
            if (Argument.isFailure(res)) {
                return Flag_1.Flag.fail({ tag, input: phrase, value: res });
            }
            return { tag, input: phrase, value: res };
        };
    }
    static taggedUnion(...types) {
        return async function typeFn(message, phrase) {
            for (let entry of types) {
                entry = Argument.tagged(entry);
                const res = await Argument.cast(entry, this.handler.types, message, phrase);
                if (!Argument.isFailure(res))
                    return res;
            }
            return null;
        };
    }
    static isFailure(value) {
        return value == null || Flag_1.Flag.is(value, "fail");
    }
    async process(message, phrase) {
        const commandDefs = this.command.argumentDefaults;
        const handlerDefs = this.handler.handling.argumentDefaults;
        const optional = __1.Util.choice(this.prompt && this.prompt.optional, commandDefs.prompt && commandDefs.prompt.optional, handlerDefs.prompt && handlerDefs.prompt.optional);
        const doOtherwise = async (failure) => {
            const otherwise = __1.Util.choice(this.otherwise, commandDefs.otherwise, handlerDefs.otherwise);
            const modifyOtherwise = __1.Util.choice(this.modifyOtherwise, commandDefs.modifyOtherwise, handlerDefs.modifyOtherwise);
            let text = await __1.Util.intoCallable(otherwise).call(this, message.ctx, {
                phrase,
                failure,
            });
            if (Array.isArray(text)) {
                text = text.join("\n");
            }
            if (modifyOtherwise) {
                text = await modifyOtherwise.call(this, message.ctx, text, {
                    phrase,
                    failure: failure,
                });
                if (Array.isArray(text)) {
                    text = text.join("\n");
                }
            }
            if (text) {
                const sent = await message.channel.createMessage(text);
                if (message.ctx)
                    message.ctx.addMessage(sent);
            }
            return Flag_1.Flag.cancel();
        };
        if (!phrase && optional) {
            if (this.otherwise != null) {
                return doOtherwise();
            }
            return __1.Util.intoCallable(this.default)(message.ctx, {
                phrase,
                failure: null,
            });
        }
        const res = await this.cast(message, phrase);
        if (Argument.isFailure(res)) {
            if (this.otherwise != null) {
                return doOtherwise(res);
            }
            if (this.prompt != null) {
                return this.collect(message, phrase, res);
            }
            return this.default == null
                ? res
                : __1.Util.intoCallable(this.default)(message.ctx, {
                    phrase,
                    failure: res,
                });
        }
        return res;
    }
    cast(message, phrase) {
        return Argument.cast(this.type, this.handler.types, message, phrase);
    }
    async collect(message, commandInput = "", parsedInput = null) {
        const promptOptions = {};
        Object.assign(promptOptions, this.handler.handling.argumentDefaults.prompt);
        Object.assign(promptOptions, this.command.argumentDefaults.prompt);
        Object.assign(promptOptions, this.prompt || {});
        const isInfinite = promptOptions.infinite ||
            (this.match === Constants_1.ArgumentMatches.SEPARATE && !commandInput);
        const additionalRetry = Number(Boolean(commandInput));
        const values = isInfinite ? [] : null;
        const getText = async (promptType, prompter, retryCount, inputMessage, inputPhrase, inputParsed) => {
            let text = await __1.Util.intoCallable(prompter).call(this, message.ctx, {
                retries: retryCount,
                infinite: isInfinite,
                message: inputMessage,
                phrase: inputPhrase,
                failure: inputParsed,
            });
            const Builder = Components_1.Components.get("replyBuilder");
            if (text instanceof __1.EmbedBuilder)
                text = { embed: text.build() };
            if (__1.Util.isFunction(text))
                text = (await text.call(this, new Builder(message.ctx), message.ctx)).build()[0];
            if (Array.isArray(text))
                text = text.join("\n");
            const modifier = {
                start: promptOptions.modifyStart,
                retry: promptOptions.modifyRetry,
                timeout: promptOptions.modifyTimeout,
                ended: promptOptions.modifyEnded,
                cancel: promptOptions.modifyCancel,
            }[promptType];
            if (modifier) {
                text = await modifier.call(this, message.ctx, text, {
                    retries: retryCount,
                    infinite: isInfinite,
                    message: inputMessage,
                    phrase: inputPhrase,
                    failure: inputParsed,
                });
                if (Array.isArray(text)) {
                    text = text.join("\n");
                }
            }
            return text;
        };
        // eslint-disable-next-line complexity
        const promptOne = async (prevMessage, prevInput, prevParsed, retryCount) => {
            let sentStart;
            // This is either a retry prompt, the start of a non-infinite, or the start of an infinite.
            if (retryCount !== 1 || !isInfinite || !values.length) {
                const promptType = retryCount === 1 ? "start" : "retry";
                const prompter = retryCount === 1 ? promptOptions.start : promptOptions.retry;
                const startText = await getText(promptType, prompter, retryCount, prevMessage, prevInput, prevParsed);
                if (startText) {
                    sentStart = await message.ctx.reply(startText);
                    if (message.ctx) {
                        message.ctx.setEditable(false);
                        message.ctx.setLastResponse(sentStart);
                        message.ctx.addMessage(sentStart);
                    }
                }
            }
            let input;
            try {
                input = await this.client.util.awaitMessages(message.channel, {
                    limit: 1,
                    idle: promptOptions.time,
                    filter: ([m]) => m.author.id === message.author.id,
                }).then((c) => c.first[1]);
                message.ctx.addMessage(input);
            }
            catch (err) {
                const timeoutText = await getText("timeout", promptOptions.timeout, retryCount, prevMessage, prevInput, "");
                if (timeoutText) {
                    const sentTimeout = await message.channel.createMessage(timeoutText);
                    message.ctx.addMessage(sentTimeout);
                }
                return Flag_1.Flag.cancel();
            }
            if (promptOptions.breakout) {
                const looksLike = await this.handler.parseCommand(input);
                if (looksLike && looksLike.command)
                    return Flag_1.Flag.retry(input);
            }
            if (input.content.toLowerCase() === promptOptions.cancelWord.toLowerCase()) {
                const cancelText = await getText("cancel", promptOptions.cancel, retryCount, input, input.content, "cancel");
                if (cancelText) {
                    const sentCancel = await message.channel.createMessage(cancelText);
                    if (message.ctx)
                        message.ctx.addMessage(sentCancel);
                }
                return Flag_1.Flag.cancel();
            }
            if (isInfinite &&
                input.content.toLowerCase() === promptOptions.stopWord.toLowerCase()) {
                if (!values.length)
                    return promptOne(input, input.content, null, retryCount + 1);
                return values;
            }
            const parsedValue = await this.cast(input, input.content);
            if (Argument.isFailure(parsedValue)) {
                if (retryCount <= promptOptions.retries) {
                    return promptOne(input, input.content, parsedValue, retryCount + 1);
                }
                const endedText = await getText("ended", promptOptions.ended, retryCount, input, input.content, "stop");
                if (endedText) {
                    const sentEnded = await message.channel.createMessage(endedText);
                    if (message.ctx)
                        message.ctx.addMessage(sentEnded);
                }
                return Flag_1.Flag.cancel();
            }
            if (isInfinite) {
                values.push(parsedValue);
                const limit = promptOptions.limit;
                if (values.length < limit)
                    return promptOne(message, input.content, parsedValue, 1);
                return values;
            }
            return parsedValue;
        };
        this.handler.addPrompt(message.channel, message.author);
        const returnValue = await promptOne(message, commandInput, parsedInput, 1 + additionalRetry);
        message.ctx.setEditable(false);
        this.handler.removePrompt(message.channel, message.author);
        return returnValue;
    }
}
exports.Argument = Argument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJndW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2NvbXBvbmVudHMvY29tbWFuZC9hcmd1bWVudC9Bcmd1bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWVBLDJEQUE2RTtBQUU3RSxtQ0FBK0Q7QUFDL0QsaUNBQThCO0FBRzlCLG9EQUFpRDtBQUVqRCxNQUFhLFFBQVE7SUFhbkIsWUFDUyxPQUFnQixFQUN2QixFQUNFLEtBQUssR0FBRywyQkFBZSxDQUFDLE1BQU0sRUFDOUIsSUFBSSxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUMzQixJQUFJLEVBQ0osYUFBYSxHQUFHLEtBQUssRUFDckIsS0FBSyxFQUNMLFNBQVMsR0FBRyxLQUFLLEVBQ2pCLEtBQUssR0FBRyxRQUFRLEVBQ2hCLE1BQU0sRUFDTixPQUFPLEVBQUUsWUFBWSxHQUFHLElBQUksRUFDNUIsU0FBUyxFQUNULGVBQWUsTUFDSSxFQUFFO1FBYmhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFldkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTztZQUNWLE9BQU8sWUFBWSxLQUFLLFVBQVU7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