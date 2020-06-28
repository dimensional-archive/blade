import { ArgumentTypeCaster } from "./Types";
import { BladeClient, CommandStore, InhibitorStore, ListenerStore, MonitorStore, Storage } from "../../../..";
import { ArgumentTypes } from "../../../../utils/Constants";
import { URL } from "url";
import { Constants, Message } from "@kyu/eris";

export class TypeResolver {
  public client: BladeClient;
  public types: Storage<string, ArgumentTypeCaster> = new Storage();

  /* Handlers */
  public commands: CommandStore;
  public inhibitors: InhibitorStore | null;
  public listeners: ListenerStore | null;
  public monitors: MonitorStore | null;

  constructor(public handler: CommandStore) {
    this.client = handler.client;

    this.commands = handler;
    this.inhibitors = null;
    this.listeners = null;
    this.monitors = null;

    this.addBuiltInTypes();
  }

  public addBuiltInTypes(): void {
    const builtins: Record<string, ArgumentTypeCaster> = {
      [ArgumentTypes.STRING]: (message: Message, phrase: any) => {
        return phrase || null;
      },

      [ArgumentTypes.LOWERCASE]: (message: Message, phrase: any) => {
        return phrase ? phrase.toLowerCase() : null;
      },

      [ArgumentTypes.UPPERCASE]: (message: Message, phrase: any) => {
        return phrase ? phrase.toUpperCase() : null;
      },

      [ArgumentTypes.CHAR_CODES]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const codes: any[] = [];
        for (const char of phrase) codes.push(char.charCodeAt(0));
        return codes;
      },

      [ArgumentTypes.NUMBER]: (message: Message, phrase: any) => {
        if (!phrase || isNaN(phrase)) return null;
        return parseFloat(phrase);
      },

      [ArgumentTypes.INTEGER]: (message: Message, phrase: any) => {
        if (!phrase || isNaN(phrase)) return null;
        return parseInt(phrase);
      },

      [ArgumentTypes.BIGINT]: (message: Message, phrase: any) => {
        if (!phrase || isNaN(phrase)) return null;
        return BigInt(phrase); // eslint-disable-line no-undef, new-cap
      },

      // Just for fun.
      [ArgumentTypes.EMOJINT]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const n = phrase.replace(/0⃣|1⃣|2⃣|3⃣|4⃣|5⃣|6⃣|7⃣|8⃣|9⃣|🔟/g, (m) => {
          return [
            "0⃣",
            "1⃣",
            "2⃣",
            "3⃣",
            "4⃣",
            "5⃣",
            "6⃣",
            "7⃣",
            "8⃣",
            "9⃣",
            "🔟",
          ].indexOf(m);
        });

        if (isNaN(n)) return null;
        return parseInt(n);
      },

      [ArgumentTypes.URL]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        if (/^<.+>$/.test(phrase)) phrase = phrase.slice(1, -1);

        try {
          return new URL(phrase);
        } catch (err) {
          return null;
        }
      },

      [ArgumentTypes.DATE]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const timestamp = Date.parse(phrase);
        if (isNaN(timestamp)) return null;
        return new Date(timestamp);
      },

      [ArgumentTypes.COLOR]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const color = parseInt(phrase.replace("#", ""), 16);
        if (color < 0 || color > 0xffffff || isNaN(color)) {
          return null;
        }

        return color;
      },

      [ArgumentTypes.USER]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.util.resolveUser(phrase, this.client.users);
      },

      [ArgumentTypes.USERS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const users = this.client.util.resolveUsers(
          phrase,
          this.client.users
        );
        return users.length ? users : null;
      },

      [ArgumentTypes.MEMBER]: (message: Message, phrase: any) => {
        console.log("member")
        if (!phrase) return null;
        return this.client.util.resolveMember(phrase, message.guild!.members);
      },

      [ArgumentTypes.MEMBERS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const members = this.client.util.resolveMembers(
          phrase,
          message.guild!.members
        );
        return members.length ? members : null;
      },

      [ArgumentTypes.CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );
      },

      [ArgumentTypes.CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        return channels.length ? channels : null;
      },

      [ArgumentTypes.TEXT_CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channel = this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );
        if (!channel || channel.type !== 0) return null;

        return channel;
      },

      [ArgumentTypes.TEXT_CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        if (!channels.length) return null;

        const textChannels = channels.filter((c) => c.type === 0);
        return textChannels.length ? textChannels : null;
      },

      [ArgumentTypes.VOICE_CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channel = this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );
        if (!channel || channel.type !== 2) return null;

        return channel;
      },

      [ArgumentTypes.VOICE_CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        if (!channels.length) return null;

        const voiceChannels = channels.filter((c) => c.type === 2);
        return voiceChannels.length ? voiceChannels : null;
      },

      [ArgumentTypes.CATEGORY_CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channel = this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );

        // @ts-ignore
        if (!channel || channel.type !== 4) return null;

        return channel;
      },

      [ArgumentTypes.CATEGORY_CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        if (!channels.length) return null;

        // @ts-ignore
        const categoryChannels = channels.filter((c) => c.type === 4);
        return categoryChannels.length ? categoryChannels : null;
      },

      [ArgumentTypes.NEWS_CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channel = this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );
        if (!channel || channel.type !== 5) return null;

        return channel;
      },

      [ArgumentTypes.NEWS_CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        if (!channels.length) return null;

        const newsChannels = channels.filter((c) => c.type === 5);
        return newsChannels.length ? newsChannels : null;
      },

      [ArgumentTypes.STORE_CHANNEL]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channel = this.client.util.resolveChannel(
          phrase,
          message.guild!.channels
        );
        // @ts-ignore
        if (!channel || channel.type !== 6) return null;

        return channel;
      },

      [ArgumentTypes.STORE_CHANNELS]: (message: Message, phrase: any) => {
        if (!phrase) return null;

        const channels = this.client.util.resolveChannels(
          phrase,
          message.guild!.channels
        );
        if (!channels.length) return null;

        // @ts-ignore
        const storeChannels = channels.filter((c) => c.type === 6);
        return storeChannels.length ? storeChannels : null;
      },

      [ArgumentTypes.ROLE]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.util.resolveRole(phrase, message.guild!.roles);
      },

      [ArgumentTypes.ROLES]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const roles = this.client.util.resolveRoles(
          phrase,
          message.guild!.roles
        );
        return roles.length ? roles : null;
      },

      [ArgumentTypes.EMOJI]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.util.resolveEmoji(phrase, message.guild!.emojis);
      },

      [ArgumentTypes.EMOJIS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const emojis = this.client.util.resolveEmojis(
          phrase,
          message.guild!.emojis
        );
        return emojis.length ? emojis : null;
      },

      [ArgumentTypes.GUILD]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.util.resolveGuild(phrase, this.client.guilds);
      },

      [ArgumentTypes.GUILDS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const guilds = this.client.util.resolveGuilds(phrase, this.client.guilds);
        return guilds.length ? guilds : null;
      },

      [ArgumentTypes.MESSAGE]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return message.channel.messages.get(phrase)
      },

      [ArgumentTypes.GUILD_MESSAGE]: async (message: Message, phrase: any) => {
        if (!phrase) return null;
        for (const channel of message.guild!.channels.values()) {
          if (channel.type !== Constants.ChannelTypes.GUILD_TEXT) continue;
          try {
            return await channel.messages.get(phrase);
          } catch (err) {
            if (/^Invalid Form Body/.test(err.message)) return null;
          }
        }

        return null;
      },

      [ArgumentTypes.RELEVANT_MESSAGE]: async (message: Message, phrase: any) => {
        if (!phrase) return null;
        const hereMsg = await message.channel.messages.get(phrase)
        if (hereMsg) {
          return hereMsg;
        }

        if (message.guild) {
          for (const channel of message.guild!.channels.values()) {
            if (channel.type !== Constants.ChannelTypes.GUILD_TEXT) continue;
            try {
              return await channel.messages.get(phrase);
            } catch (err) {
              if (/^Invalid Form Body/.test(err.message)) return null;
            }
          }
        }

        return null;
      },

      [ArgumentTypes.INVITE]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.client.getInvite(phrase).catch(() => null);
      },

      [ArgumentTypes.USER_MENTION]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const id = phrase.match(/<@!?(\d{17,19})>/);
        if (!id) return null;
        return this.client.users.get(id[1]) || null;
      },

      [ArgumentTypes.MEMBER_MENTION]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const id = phrase.match(/<@!?(\d{17,19})>/);
        if (!id) return null;
        return message.guild!.members.get(id[1]) || null;
      },

      [ArgumentTypes.CHANNEL_MENTION]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const id = phrase.match(/<#(\d{17,19})>/);
        if (!id) return null;
        return message.guild!.channels.get(id[1]) || null;
      },

      [ArgumentTypes.ROLE_MENTION]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const id = phrase.match(/<@&(\d{17,19})>/);
        if (!id) return null;
        return message.guild!.roles.get(id[1]) || null;
      },

      [ArgumentTypes.EMOJI_MENTION]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        const id = phrase.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/);
        if (!id) return null;
        return message.guild!.emojis.find(e => e.id === id[1]) || null;
      },

      [ArgumentTypes.COMMAND_ALIAS]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.commands.findCommand(phrase) || null;
      },

      [ArgumentTypes.COMMAND]: (message: Message, phrase: any) => {
        if (!phrase) return null;
        return this.commands.components.get(phrase) || null;
      },

      [ArgumentTypes.INHIBITOR]: (message: Message, phrase: any) => {
        if (!phrase || !this.inhibitors) return null;
        return this.inhibitors.components.get(phrase) || null;
      },

      [ArgumentTypes.LISTENER]: (message: Message, phrase: any) => {
        if (!phrase || !this.listeners) return null;
        return this.listeners.components.get(phrase) || null;
      },
    };

    for (const [ key, value ] of Object.entries(builtins)) {
      this.types.set(key, value);
    }
  }

  public type(name: string): ArgumentTypeCaster {
    return this.types.get(name)!;
  }

  public addType(name: string, fn: ArgumentTypeCaster): TypeResolver {
    this.types.set(name, fn);
    return this;
  }

  public addTypes(types: Record<string, ArgumentTypeCaster>): TypeResolver {
    for (const [ key, value ] of Object.entries(types)) {
      this.addType(key, value);
    }

    return this;
  }
}