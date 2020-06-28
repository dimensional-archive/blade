import { Message, MessageContent } from "eris";

import type {
  ArgumentMatch,
  ArgumentType,
  ArgumentTypeCaster,
  ArgumentPromptOptions,
  Supplier,
  FailureData,
  Modifier,
  ArgumentOptions,
  ParsedValuePredicate,
  ArgumentPromptData,
} from "./Types";

import { Structures } from "../../Structures";
import { BladeClient } from "../../Client";
import { CommandStore, Command } from "../../structures";
import { ArgumentMatches, ArgumentTypes, Util, EmbedBuilder } from "../../util";
import { TypeResolver } from "./TypeResolver";
import { Flag } from "./Flag";
import { Content } from "../Context";

export class Argument {
  public match: ArgumentMatch;
  public type: ArgumentType | ArgumentTypeCaster;
  public flag?: string | string[];
  public multipleFlags: boolean;
  public index?: number;
  public unordered: boolean | number | number[];
  public limit: number;
  public prompt?: ArgumentPromptOptions;
  public default: any | Supplier<FailureData, any>;
  public otherwise?: Content | Supplier<FailureData, Content>;
  public modifyOtherwise: Modifier<FailureData, Content>;

  constructor(
    public command: Command,
    {
      match = ArgumentMatches.PHRASE,
      type = ArgumentTypes.STRING,
      flag,
      multipleFlags = false,
      index,
      unordered = false,
      limit = Infinity,
      prompt,
      default: defaultValue = null,
      otherwise,
      modifyOtherwise,
    }: ArgumentOptions = {}
  ) {
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
    this.modifyOtherwise = modifyOtherwise!;
  }

  public get client(): BladeClient {
    return this.command.client;
  }

  public get handler(): CommandStore {
    return this.command.store;
  }

  public static async cast(
    type: ArgumentType | ArgumentTypeCaster,
    resolver: TypeResolver,
    message: Message,
    phrase: string
  ) {
    if (Array.isArray(type)) {
      for (const entry of type) {
        if (Array.isArray(entry)) {
          if (entry.some((t) => t.toLowerCase() === phrase.toLowerCase())) {
            return entry[0];
          }
        } else if (entry.toLowerCase() === phrase.toLowerCase()) {
          return entry;
        }
      }

      return null;
    }

    if (typeof type === "function") {
      let res = type(message!, phrase);
      if (Util.isPromise(res)) res = await res;
      return res;
    }

    if (type instanceof RegExp) {
      const match = phrase.match(type);
      if (!match) return null;

      const matches: any[] = [];

      if (type.global) {
        let matched;

        while ((matched = type.exec(phrase)) != null) {
          matches.push(matched);
        }
      }

      return { match, matches };
    }

    if (resolver.type(type)) {
      let res = resolver.type(type).call(this, message!, phrase);
      if (Util.isPromise(res)) res = await res;
      return res;
    }

    return phrase || null;
  }

  public static union(
    ...types: (ArgumentType | ArgumentTypeCaster)[]
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      for (let entry of types) {
        if (typeof entry === "function") entry = entry.bind(this);
        const res = await Argument.cast(
          entry,
          this.handler.types,
          message!,
          phrase
        );
        if (!Argument.isFailure(res)) return res;
      }

      return null;
    };
  }

  public static product(
    ...types: (ArgumentType | ArgumentTypeCaster)[]
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      const results: any[] = [];
      for (let entry of types) {
        if (typeof entry === "function") entry = entry.bind(this);
        const res = await Argument.cast(
          entry,
          this.handler.types,
          message!,
          phrase
        );
        if (Argument.isFailure(res)) return res;
        results.push(res);
      }

      return results;
    };
  }

  public static validate(
    type: ArgumentType | ArgumentTypeCaster,
    predicate: ParsedValuePredicate
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      if (typeof type === "function") type = type.bind(this);
      const res = await Argument.cast(
        type,
        this.handler.types,
        message!,
        phrase
      );
      if (Argument.isFailure(res)) return res;
      if (!predicate.call(this, message!, phrase, res)) return null;
      return res;
    };
  }

  public static range(
    type: ArgumentType | ArgumentTypeCaster,
    min: number,
    max: number,
    inclusive = false
  ): ArgumentTypeCaster {
    return Argument.validate(type, (_, p, x) => {
      const o =
        typeof x === "number" || typeof x === "bigint"
          ? x
          : x.length != null
          ? x.length
          : x.size != null
          ? x.size
          : x;

      return o >= min && (inclusive ? o <= max : o < max);
    });
  }

  public static compose(
    ...types: (ArgumentType | ArgumentTypeCaster)[]
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      let acc = phrase;
      for (let entry of types) {
        if (typeof entry === "function") entry = entry.bind(this);
        acc = await Argument.cast(entry, this.handler.types, message!, acc);
        if (Argument.isFailure(acc)) return acc;
      }

      return acc;
    };
  }

  public static composeWithFailure(
    ...types: (ArgumentType | ArgumentTypeCaster)[]
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      let acc = phrase;
      for (let entry of types) {
        if (typeof entry === "function") entry = entry.bind(this);
        acc = await Argument.cast(entry, this.handler.types, message!, acc);
      }

      return acc;
    };
  }

  public static withInput(
    type: ArgumentType | ArgumentTypeCaster
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      if (typeof type === "function") type = type.bind(this);
      const res = await Argument.cast(
        type,
        this.handler.types,
        message!,
        phrase
      );
      if (Argument.isFailure(res)) {
        return Flag.fail({ input: phrase, value: res });
      }

      return { input: phrase, value: res };
    };
  }

  public static tagged(
    type: ArgumentType | ArgumentTypeCaster,
    tag = type
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      if (typeof type === "function") type = type.bind(this);
      const res = await Argument.cast(
        type,
        this.handler.types,
        message!,
        phrase
      );
      if (Argument.isFailure(res)) {
        return Flag.fail({ tag, value: res });
      }

      return { tag, value: res };
    };
  }

  public static taggedWithInput(
    type: ArgumentType | ArgumentTypeCaster,
    tag = type
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      if (typeof type === "function") type = type.bind(this);
      const res = await Argument.cast(
        type,
        this.handler.types,
        message!,
        phrase
      );
      if (Argument.isFailure(res)) {
        return Flag.fail({ tag, input: phrase, value: res });
      }

      return { tag, input: phrase, value: res };
    };
  }

  public static taggedUnion(
    ...types: (ArgumentType | ArgumentTypeCaster)[]
  ): ArgumentTypeCaster {
    return async function typeFn(this: Argument, message, phrase) {
      for (let entry of types) {
        entry = Argument.tagged(entry);
        const res = await Argument.cast(
          entry,
          this.handler.types,
          message!,
          phrase
        );
        if (!Argument.isFailure(res)) return res;
      }

      return null;
    };
  }

  public static isFailure(value: any): boolean {
    return value == null || Flag.is(value, "fail");
  }

  public async process(message: Message, phrase: string): Promise<Flag | any> {
    const commandDefs = this.command.argumentDefaults;
    const handlerDefs = this.handler.handling.argumentDefaults!;
    const optional = Util.choice(
      this.prompt && this.prompt.optional,
      commandDefs.prompt && commandDefs.prompt.optional,
      handlerDefs.prompt && handlerDefs.prompt.optional
    );

    const doOtherwise = async (failure?: FailureData) => {
      const otherwise = Util.choice(
        this.otherwise,
        commandDefs.otherwise,
        handlerDefs.otherwise
      );

      const modifyOtherwise = Util.choice(
        this.modifyOtherwise,
        commandDefs.modifyOtherwise,
        handlerDefs.modifyOtherwise
      );

      let text = await Util.intoCallable(otherwise).call(this, message.ctx, {
        phrase,
        failure,
      });
      if (Array.isArray(text)) {
        text = text.join("\n");
      }

      if (modifyOtherwise) {
        text = await modifyOtherwise.call(this, message.ctx, text, {
          phrase,
          failure: failure as any,
        });
        if (Array.isArray(text)) {
          text = text.join("\n");
        }
      }

      if (text) {
        const sent = await message.channel.createMessage(text);
        if (message.ctx) message.ctx.addMessage(sent);
      }

      return Flag.cancel();
    };

    if (!phrase && optional) {
      if (this.otherwise != null) {
        return doOtherwise();
      }

      return Util.intoCallable(this.default)(message.ctx, {
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
        : Util.intoCallable(this.default)(message.ctx, {
            phrase,
            failure: res,
          });
    }

    return res;
  }

  public cast(message: Message, phrase: string): Promise<any> {
    return Argument.cast(this.type, this.handler.types, message, phrase);
  }

  public async collect(
    message: Message,
    commandInput = "",
    parsedInput: any = null
  ): Promise<Flag | any> {
    const promptOptions: ArgumentPromptOptions = {};
    Object.assign(
      promptOptions,
      this.handler.handling.argumentDefaults!.prompt
    );
    Object.assign(promptOptions, this.command.argumentDefaults.prompt);
    Object.assign(promptOptions, this.prompt || {});

    const isInfinite =
      promptOptions.infinite ||
      (this.match === ArgumentMatches.SEPARATE && !commandInput);
    const additionalRetry = Number(Boolean(commandInput));
    const values: any[] | null = isInfinite ? [] : null;

    const getText = async (
      promptType: string,
      prompter: Content | Supplier<ArgumentPromptData, Content>,
      retryCount: number,
      inputMessage: Message,
      inputPhrase: string,
      inputParsed: any
    ): Promise<MessageContent> => {
      let text = await Util.intoCallable(prompter).call(this, message.ctx, {
        retries: retryCount,
        infinite: isInfinite,
        message: inputMessage,
        phrase: inputPhrase,
        failure: inputParsed,
      });

      const Builder = Structures.get("replyBuilder");
      if (text instanceof EmbedBuilder) text = { embed: text.build() };
      if (Util.isFunction(text))
        text = (
          await text.call(this, new Builder(message.ctx), message.ctx)
        ).build()[0];
      if (Array.isArray(text)) text = text.join("\n");

      const modifier: Modifier<ArgumentPromptData, Content> = ({
        start: promptOptions.modifyStart,
        retry: promptOptions.modifyRetry,
        timeout: promptOptions.modifyTimeout,
        ended: promptOptions.modifyEnded,
        cancel: promptOptions.modifyCancel,
      } as Record<string, any>)[promptType];

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
    const promptOne = async (
      prevMessage: Message,
      prevInput: string,
      prevParsed: any,
      retryCount: number
    ): Promise<any> => {
      let sentStart;
      // This is either a retry prompt, the start of a non-infinite, or the start of an infinite.
      if (retryCount !== 1 || !isInfinite || !values!.length) {
        const promptType = retryCount === 1 ? "start" : "retry";
        const prompter =
          retryCount === 1 ? promptOptions.start : promptOptions.retry;

        const startText = await getText(
          promptType,
          prompter!,
          retryCount,
          prevMessage,
          prevInput,
          prevParsed
        );

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
        input = await this.client!.util.awaitMessages(message.channel, {
          limit: 1,
          idle: promptOptions.time,
          filter: ([m]) => m.author.id === message.author.id,
        }).then((c) => c.first![1]);

        message.ctx.addMessage(input);
      } catch (err) {
        const timeoutText = await getText(
          "timeout",
          promptOptions.timeout!,
          retryCount,
          prevMessage,
          prevInput,
          ""
        );

        if (timeoutText) {
          const sentTimeout = await message.channel.createMessage(timeoutText);
          message.ctx.addMessage(sentTimeout);
        }

        return Flag.cancel();
      }

      if (promptOptions.breakout) {
        const looksLike = await this.handler.parseCommand(input);
        if (looksLike && looksLike.command) return Flag.retry(input);
      }

      if (
        input.content.toLowerCase() === promptOptions.cancelWord!.toLowerCase()
      ) {
        const cancelText = await getText(
          "cancel",
          promptOptions.cancel!,
          retryCount,
          input,
          input.content,
          "cancel"
        );
        if (cancelText) {
          const sentCancel = await message.channel.createMessage(cancelText);
          if (message.ctx) message.ctx.addMessage(sentCancel);
        }

        return Flag.cancel();
      }

      if (
        isInfinite &&
        input.content.toLowerCase() === promptOptions.stopWord!.toLowerCase()
      ) {
        if (!values!.length)
          return promptOne(input, input.content, null, retryCount + 1);
        return values;
      }

      const parsedValue = await this.cast(input, input.content);
      if (Argument.isFailure(parsedValue)) {
        if (retryCount <= promptOptions.retries!) {
          return promptOne(input, input.content, parsedValue, retryCount + 1);
        }

        const endedText = await getText(
          "ended",
          promptOptions.ended!,
          retryCount,
          input,
          input.content,
          "stop"
        );
        if (endedText) {
          const sentEnded = await message.channel.createMessage(endedText);
          if (message.ctx) message.ctx.addMessage(sentEnded);
        }

        return Flag.cancel();
      }

      if (isInfinite) {
        values!.push(parsedValue);
        const limit = promptOptions.limit;
        if (values!.length < limit!)
          return promptOne(message, input.content, parsedValue, 1);

        return values;
      }

      return parsedValue;
    };

    this.handler.addPrompt(message.channel, message.author);

    const returnValue = await promptOne(
      message!,
      commandInput,
      parsedInput,
      1 + additionalRetry
    );

    message.ctx.setEditable(false);
    this.handler.removePrompt(message.channel, message.author);
    return returnValue;
  }
}
