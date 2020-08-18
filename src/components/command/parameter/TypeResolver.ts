import { URL } from "url";
import { Store } from "@kyudiscord/neo";

import type { BladeClient } from "../../../Client";
import type { Context } from "../context/Context";

export enum ParamType {
  STRING = "string",
  NUMBER = "number",
  FLAG = "flag",
  MEMBER = "member",
  USER = "user",
  GUILD = "guild",
  VOICE_CHANNEL = "voiceChannel",
  TEXT_CHANNEL = "textChannel",
  ROLE = "role",
  EMOJI = "emoji",
  URL = "url",
  INTEGER = "integer",
  EMOJI_INT = "emojiInt",
  DATE = "date",
  COLOR = "color",
  BIGINT = "bigint"
}

export class TypeResolver {
  public static BUILT_IN: Record<string, Resolver> = {
    [ParamType.STRING]: (phrase) => {
      return phrase
        ? phrase.toString()
        : null;
    },

    [ParamType.NUMBER]: (phrase) => {
      return !phrase || Number.isNaN(phrase)
        ? parseFloat(phrase)
        : null;
    },

    [ParamType.INTEGER]: (phrase) => {
      return !phrase || Number.isNaN(phrase)
        ? parseInt(phrase)
        : null;
    },

    [ParamType.BIGINT]: (phrase) => {
      return !phrase || Number.isNaN(phrase)
        ? BigInt(phrase)
        : null;
    },

    [ParamType.URL]: (phrase) => {
      if (!phrase) return null;
      if (/^<.+>$/.test(phrase)) phrase = phrase.slice(1, -1);

      try {
        return new URL(phrase);
      } catch (e) {
        return null;
      }
    },

    [ParamType.DATE]: (phrase) => {
      if (!phrase) return null;

      const timestamp = Date.parse(phrase);
      return isNaN(timestamp)
        ? null
        : new Date(phrase);
    },

    [ParamType.COLOR]: (phrase) => {
      if (!phrase) return null;

      const color = parseInt(phrase.replace("#", ""), 16);
      return color < 0 || color > 0xFFFFFF || isNaN(color)
        ? null
        : color;
    }
  }

  /**
   * The client instance.
   */
  public readonly client: BladeClient;

  /**
   * Types to use.
   */
  public readonly types: Store<string, Resolver>;

  /**
   * @param client
   */
  public constructor(client: BladeClient) {
    this.client = client;
    this.types = new Store();

    this.addBuiltIns();
  }

  /**
   * Add all built-in type resolvers.
   */
  public addBuiltIns(): this {
    for (const [ key, resolver ] of Object.entries(TypeResolver.BUILT_IN)) {
      this.types.set(key, resolver);
    }

    return this;
  }

  /**
   * Get a type resolver.
   * @param type
   * @since 1.0.0
   */
  public type(type: ParamType): Resolver | undefined {
    return this.types.get(type);
  }
}

export type Resolver = (phrase: string, ctx: Context) => Promise<unknown> | unknown;
