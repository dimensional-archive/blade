import type { ParamType } from "./TypeResolver";
import type { Context } from "../context/Context";

export enum ActionKey {
  DECLARE_FLAG,
  MAKE_GREEDY,
  DECLARE_TYPE,
  VALIDATE,
  DECLARE_MATCH
}

export class TypeBuilder {
  private readonly _actions: BuilderAction[] = [];

  /**
   * Actions the user wants done or smth idrfk.
   * Sorts the actions: flag? -> greedy? -> type | regex | custom -> validations?
   */
  public getActions(): ParsedActions {
    const flag = this._actions.find(a => a.key === ActionKey.DECLARE_FLAG);
    const type = this._actions.find(a => a.key === ActionKey.DECLARE_TYPE);
    const greedy = this._actions.find(a => a.key === ActionKey.MAKE_GREEDY);
    const validations = this._actions.filter(a => a.key === ActionKey.VALIDATE);
    const match = this._actions.find(a => a.key === ActionKey.DECLARE_MATCH);

    return {
      flag: flag ? flag.value : undefined,
      greedy: greedy ? greedy.value : undefined,
      validations: validations.map((v) => v.value),
      match: match ? match.value : undefined,
      type: type ? type.value : undefined
    };
  }

  /**
   * Declare the type of this parameter..
   * @param type
   */
  public resolve(type: ParamType): TypeBuilder {
    this._actions.push({
      key: ActionKey.DECLARE_TYPE,
      value: type
    });

    return this;
  }

  /**
   * Consumes the rest of the content.
   */
  public rest(): TypeBuilder {
    this._actions.push({
      key: ActionKey.DECLARE_MATCH,
      value: "rest"
    });

    return this;
  }

  /**
   * Declares a custom type for this parameter.
   * @param type
   */
  public custom(type: TypeCast): TypeBuilder {
    this._actions.push({
      key: ActionKey.DECLARE_TYPE,
      value: type
    });

    return this;
  }

  /**
   * Uses a regular expression as the parameter type.
   * @param regex
   */
  public match(regex: RegExp): TypeBuilder {
    this._actions.push({
      key: ActionKey.DECLARE_TYPE,
      value: (p: string) => regex.exec(p)
    });

    return this;
  }

  /**
   * Validate the parameter.
   * @param validation
   */
  public validate<T>(validation: Validation<T>): TypeBuilder {
    this._actions.push({
      key: ActionKey.VALIDATE,
      value: validation
    });

    return this;
  }

  /**
   * Validates the range of a number parameter.
   * @param from
   * @param to
   * @param orEqualTo
   */
  public range(from: number, to: number, orEqualTo = true): TypeBuilder {
    this._actions.push({
      key: ActionKey.VALIDATE,
      value: (val: string | number) => {
        const num = Number(val);
        return orEqualTo
          ? (num >= from && num <= to)
          : (num > from && num < to);
      }
    });

    return this;
  }

  /**
   * Turns this parameter into a flag.
   * @param settings The settings to use when parsing this parameter.
   */
  public flag(settings: FlagSettings = {}): TypeBuilder {
    // flag declarations get hoisted.
    this._actions.unshift({
      key: ActionKey.DECLARE_FLAG,
      value: {
        aliases: settings.aliases ?? [],
        option: settings.option ?? false
      }
    });

    return this;
  }

  /**
   * Makes this parameter greedy.
   */
  public greedy(settings: GreedySettings = {}): TypeBuilder {
    this._actions.push({
      key: ActionKey.MAKE_GREEDY,
      value: settings
    });

    return this;
  }

  /**
   * Whether or not the value is of something.
   * @param type
   */
  public of(type: Array<string | string[]>): TypeBuilder {
    this._actions.push({
      key: ActionKey.DECLARE_TYPE,
      value: (p: string) => {
        for (const entry of type) {
          if (Array.isArray(entry)) {
            if (entry.some(t => t.toLowerCase() === p.toLowerCase())) {
              return entry[0];
            }
          } else if (entry.toLowerCase() === p.toLowerCase()) {
            return entry;
          }
        }

        return null;
      }
    });

    return this;
  }
}

export type Validation<T = unknown> = (v: T, ctx: Context) => boolean

export type TypeCast = (phrase: string, ctx: Context) => unknown;

export type ParameterType = RegExp | ParamType | TypeCast;

export interface BuilderAction<V = any> {
  key: ActionKey;
  value: V;
}

export interface FlagSettings {
  aliases?: string[];
  option?: boolean;
}

export interface GreedySettings {
  min?: number;
  max?: number;
}

export interface ParsedActions {
  flag?: FlagSettings;
  greedy?: GreedySettings;
  validations: Validation[];
  type: ParameterType;
  match?: "rest";
}

