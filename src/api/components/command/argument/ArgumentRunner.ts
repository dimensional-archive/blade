import { Command } from "../Command";
import { Flag } from "./Flag";
import { ArgumentOptions } from "./Types";
import { ContentParserResult } from "./ContentParser";
import { Context } from "../Context";
import { Message } from "eris";
import { ArgumentMatches } from "../../../../utils/Constants";
import { IllegalArgumentError } from "@ayanaware/errors";
import { Argument } from "./Argument";

export type ArgumentGenerator = (ctx: Context, parsed: ContentParserResult, state: ArgumentRunnerState) => IterableIterator<ArgumentOptions | Flag>;

export interface ArgumentRunnerState {
  usedIndices: Set<number>;
  phraseIndex: number;
  index: number;
}

export class ArgumentRunner {
  constructor(public command: Command) {}

  public get client() {
    return this.command.client;
  }

  public get handler() {
    return this.command.store;
  }

  public async run(
    message: Message,
    parsed: ContentParserResult,
    generator: ArgumentGenerator
  ) {
    const state: ArgumentRunnerState = {
      usedIndices: new Set(),
      phraseIndex: 0,
      index: 0,
    };

    const augmentRest = (val: any) => {
      if (Flag.is(val, "continue")) {
        val.rest = parsed.all
          .slice(state.index)
          .map((x) => x.raw)
          .join("");
      }
    };

    const iter = generator(message.ctx, parsed, state);
    let curr = await iter.next();
    while (!curr.done) {
      const value = curr.value;
      if (ArgumentRunner.isShortCircuit(value)) {
        augmentRest(value);
        return value;
      }

      const res = await this.runOne(
        message,
        parsed,
        state,
        new Argument(this.command, value)
      );
      if (ArgumentRunner.isShortCircuit(res)) {
        augmentRest(res);
        return res;
      }

      curr = await iter.next(res);
    }

    augmentRest(curr.value);
    return curr.value;
  }

  public runOne(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const cases: Record<ArgumentMatches, Function> = {
      [ArgumentMatches.PHRASE]: this.runPhrase,
      [ArgumentMatches.FLAG]: this.runFlag,
      [ArgumentMatches.OPTION]: this.runOption,
      [ArgumentMatches.REST]: this.runRest,
      [ArgumentMatches.SEPARATE]: this.runSeparate,
      [ArgumentMatches.TEXT]: this.runText,
      [ArgumentMatches.CONTENT]: this.runContent,
      [ArgumentMatches.REST_CONTENT]: this.runRestContent,
      [ArgumentMatches.NONE]: this.runNone,
    };

    const runFn = cases[arg.match];
    if (runFn == null) {
      throw new IllegalArgumentError(`Unknown match type '${arg.match}'`);
    }

    return runFn.call(this, message, parsed, state, arg);
  }

  public async runPhrase(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ) {
    if (arg.unordered || arg.unordered === 0) {
      const indices =
        typeof arg.unordered === "number"
          ? Array.from(parsed.phrases.keys()).slice(arg.unordered)
          : Array.isArray(arg.unordered)
          ? arg.unordered
          : Array.from(parsed.phrases.keys());

      for (const i of indices) {
        if (state.usedIndices.has(i)) {
          continue;
        }

        const phrase = parsed.phrases[i] ? parsed.phrases[i].value : "";
        // `cast` is used instead of `process` since we do not want prompts.
        const res = await arg.cast(message, phrase!);
        if (res != null) {
          state.usedIndices.add(i);
          return res;
        }
      }

      // No indices matched.
      return arg.process(message, "");
    }

    const index = arg.index == null ? state.phraseIndex : arg.index;
    const ret = arg.process(
      message,
      (parsed.phrases[index] ? parsed.phrases[index].value : "")!
    );
    if (arg.index == null) {
      ArgumentRunner.increaseIndex(parsed, state);
    }

    return ret;
  }

  public async runRest(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const index = arg.index == null ? state.phraseIndex : arg.index;
    const rest = parsed.phrases
      .slice(index, index + arg.limit)
      .map((x) => x.raw)
      .join("")
      .trim();
    const ret = await arg.process(message, rest);
    if (arg.index == null) {
      ArgumentRunner.increaseIndex(parsed, state);
    }

    return ret;
  }

  async runSeparate(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const index = arg.index == null ? state.phraseIndex : arg.index;
    const phrases = parsed.phrases.slice(index, index + arg.limit);
    if (!phrases.length) {
      const ret = await arg.process(message, "");
      if (arg.index != null) {
        ArgumentRunner.increaseIndex(parsed, state);
      }

      return ret;
    }

    const res: Promise<any>[] = [];
    for (const phrase of phrases) {
      res.push(await arg.process(message, phrase.value!));
    }

    if (arg.index != null) {
      ArgumentRunner.increaseIndex(parsed, state);
    }

    return res;
  }

  public async runFlag(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const names = Array.isArray(arg.flag) ? arg.flag : [arg.flag];
    if (arg.multipleFlags) {
      return parsed.flags.filter((flag) =>
        names.some((name) => name!.toLowerCase() === flag.key!.toLowerCase())
      ).length;
    }

    const flagFound = parsed.flags.some((flag) =>
      names.some((name) => name!.toLowerCase() === flag.key!.toLowerCase())
    );

    return arg.default == null ? flagFound : !flagFound;
  }

  async runOption(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const names = Array.isArray(arg.flag) ? arg.flag : [arg.flag];
    if (arg.multipleFlags) {
      const values = parsed.optionFlags
        .filter((flag) =>
          names.some((name) => name!.toLowerCase() === flag.key!.toLowerCase())
        )
        .map((x) => x.value)
        .slice(0, arg.limit);

      const res: Promise<any>[] = [];
      for (const value of values) {
        res.push(await arg.process(message, value!));
      }

      return res;
    }

    const foundFlag = parsed.optionFlags.find((flag) =>
      names.some((name) => name!.toLowerCase() === flag.key!.toLowerCase())
    );

    return arg.process(message, (foundFlag != null ? foundFlag.value : "")!);
  }

  public runText(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const index = arg.index == null ? 0 : arg.index;
    const text = parsed.phrases
      .slice(index, index + arg.limit)
      .map((x) => x.raw)
      .join("")
      .trim();
    return arg.process(message, text);
  }

  public runContent(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const index = arg.index == null ? 0 : arg.index;
    const content = parsed.all
      .slice(index, index + arg.limit)
      .map((x) => x.raw)
      .join("")
      .trim();
    return arg.process(message, content);
  }

  public async runRestContent(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    const index = arg.index == null ? state.index : arg.index;
    const rest = parsed.all
      .slice(index, index + arg.limit)
      .map((x) => x.raw)
      .join("")
      .trim();
    const ret = await arg.process(message, rest);
    if (arg.index == null) {
      ArgumentRunner.increaseIndex(parsed, state);
    }

    return ret;
  }

  public runNone(
    message: Message,
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    arg: Argument
  ): Promise<Flag | any> {
    return arg.process(message, "");
  }

  public static increaseIndex(
    parsed: ContentParserResult,
    state: ArgumentRunnerState,
    n = 1
  ): void {
    state.phraseIndex += n;
    while (n > 0) {
      do {
        state.index++;
      } while (
        parsed.all[state.index] &&
        parsed.all[state.index].type !== "Phrase"
        );
      n--;
    }
  }

  public static isShortCircuit(value: any): boolean {
    return (
      Flag.is(value, "cancel") ||
      Flag.is(value, "retry") ||
      Flag.is(value, "continue")
    );
  }

  public static fromArguments(args: [string, Argument][]): ArgumentGenerator {
    // @ts-ignore
    return function* generate() {
      const res: Record<string, Argument> = {};
      for (const [id, arg] of args) {
        // @ts-ignore
        res[id] = yield arg;
      }

      return res;
    };
  }
}