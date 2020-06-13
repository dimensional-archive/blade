"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
const Constants_1 = require("../../../../utils/Constants");
const __1 = require("../../../..");
const Flag_1 = require("./Flag");
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
                    // @ts-ignore
                    failure,
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
            if (__1.Util.isFunction(text))
                text = (await text.call(this, new __1.ReplyBuilder(message.ctx), message.ctx)).build()[0];
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
                input = (await this.client.util.awaitMessages(message.channel, {
                    limit: 1,
                    idle: promptOptions.time,
                    filter: ([m]) => m.author.id === message.author.id,
                }).then((c) => c.first[1]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJndW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2NvbXBvbmVudHMvY29tbWFuZC9hcmd1bWVudC9Bcmd1bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFlQSwyREFBNkU7QUFFN0UsbUNBQStEO0FBQy9ELGlDQUE4QjtBQUk5QixNQUFhLFFBQVE7SUFhbkIsWUFDUyxPQUFnQixFQUN2QixFQUNFLEtBQUssR0FBRywyQkFBZSxDQUFDLE1BQU0sRUFDOUIsSUFBSSxHQUFHLHlCQUFhLENBQUMsTUFBTSxFQUMzQixJQUFJLEVBQ0osYUFBYSxHQUFHLEtBQUssRUFDckIsS0FBSyxFQUNMLFNBQVMsR0FBRyxLQUFLLEVBQ2pCLEtBQUssR0FBRyxRQUFRLEVBQ2hCLE1BQU0sRUFDTixPQUFPLEVBQUUsWUFBWSxHQUFHLElBQUksRUFDNUIsU0FBUyxFQUNULGVBQWUsTUFDSSxFQUFFO1FBYmhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFldkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTztZQUNWLE9BQU8sWUFBWSxLQUFLLFVBQVU7Z0JBQ2hDLENBQUMs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