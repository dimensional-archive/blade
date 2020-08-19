import { URL } from "url";
import { ChannelType } from "@kyudiscord/dapi";
import { Store } from "@kyudiscord/neo";

import type { BladeClient } from "../../../Client";
import type { Context } from "../context/Context";

export enum ParamType {
  STRING = "string",
  NUMBER = "number",
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
  public static BUILT_IN: Record<ParamType, Resolver> = {
    [ParamType.EMOJI](phrase, ctx) {
      if (!phrase || !ctx.guild) return null;
      return ctx.client.util.resolveEmoji(phrase, ctx.guild.emojis);
    },

    [ParamType.GUILD](phrase, ctx) {
      if (!phrase) return null;
      return ctx.client.util.resolveGuild(phrase, ctx.client.guilds);
    },

    [ParamType.EMOJI_INT](phrase) {
      if (!phrase) return null;

      // @ts-ignore
      const n = phrase.replace(/0⃣|1⃣|2⃣|3⃣|4⃣|5⃣|6⃣|7⃣|8⃣|9⃣|🔟/g, (m) => {
        return [ "0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", ].indexOf(m);
      });

      return Number.isNaN(n) ? null : parseInt(n);
    },

    [ParamType.STRING]: p => p ? p.toString() : null,

    [ParamType.NUMBER]: p => p && !Number.isNaN(p) ? parseFloat(p) : null,

    [ParamType.INTEGER]: p => p && !Number.isNaN(p) ? parseInt(p) : null,

    [ParamType.BIGINT]: p => p && !Number.isNaN(p) ? BigInt(p) : null,

    [ParamType.URL](phrase) {
      if (!phrase) return null;
      if (/^<.+>$/.test(phrase)) phrase = phrase.slice(1, -1);

      try {
        return new URL(phrase);
      } catch (e) {
        return null;
      }
    },

    [ParamType.DATE](phrase) {
      if (!phrase) return null;

      return isNaN(Date.parse(phrase))
        ? null
        : new Date(phrase);
    },

    [ParamType.COLOR](phrase) {
      if (!phrase) return null;

      const color = parseInt(phrase.replace("#", ""), 16);
      return color < 0 || color > 0xFFFFFF || isNaN(color)
        ? null
        : color;
    },

    [ParamType.MEMBER]: (phrase, ctx) => {
      if (!phrase || !ctx.guild) return null;
      return ctx.client.util.resolveMember(phrase, ctx.guild.members);
    },

    [ParamType.USER]: (phrase, ctx) => {
      if (!phrase) return null;
      return ctx.client.util.resolveUser(phrase, ctx.client.users);
    },

    [ParamType.VOICE_CHANNEL]: (phrase, ctx) => {
      if (!phrase || !ctx.guild) return null;

      const channel = ctx.client.util.resolveChannel(phrase, ctx.guild.channels);
      return !channel || channel.type !== ChannelType.GUILD_VOICE
        ? null
        : channel;
    },

    [ParamType.TEXT_CHANNEL]: (phrase, ctx) => {
      if (!phrase || !ctx.guild) return null;
      return ctx.client.util.resolveChannel(phrase, ctx.guild.channels);
    },

    [ParamType.ROLE]: (phrase, ctx) => {
      if (!phrase || !ctx.guild) return null;
      return ctx.client.util.resolveRole(phrase, ctx.guild.roles);
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
