"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            if (text instanceof __1.EmbedBuilder)
                text = { embed: text.build() };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJndW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2NvbXBvbmVudHMvY29tbWFuZC9hcmd1bWVudC9Bcmd1bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWVBLDJEQUE2RTtBQUU3RSxtQ0FBNkU7QUFDN0UsaUNBQThCO0FBSTlCLE1BQWEsUUFBUTtJQWFuQixZQUNTLE9BQWdCLEVBQ3ZCLEVBQ0UsS0FBSyxHQUFHLDJCQUFlLENBQUMsTUFBTSxFQUM5QixJQUFJLEdBQUcseUJBQWEsQ0FBQyxNQUFNLEVBQzNCLElBQUksRUFDSixhQUFhLEdBQUcsS0FBSyxFQUNyQixLQUFLLEVBQ0wsU0FBUyxHQUFHLEtBQUssRUFDakIsS0FBSyxHQUFHLFFBQVEsRUFDaEIsTUFBTSxFQUNOLE9BQU8sRUFBRSxZQUFZLEdBQUcsSUFBSSxFQUM1QixTQUFTLEVBQ1QsZUFBZSxNQUNJLEVBQUU7UUFiaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQWV2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPO1lBQ1YsT0FBTyxZQUFZLEtBQUssVUFBVTtnQkFDaEMsQ0FBQyxD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