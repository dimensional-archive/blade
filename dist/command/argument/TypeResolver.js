"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const util_1 = require("../../util");
const url_1 = require("url");
class TypeResolver {
    constructor(handler) {
        this.handler = handler;
        this.types = new util_1.Collection();
        this.client = handler.client;
        this.commands = handler;
        this.inhibitors = null;
        this.listeners = null;
        this.monitors = null;
        this.addBuiltInTypes();
    }
    addBuiltInTypes() {
        const builtins = {
            [util_1.ArgumentTypes.STRING]: (message, phrase) => {
                return phrase || null;
            },
            [util_1.ArgumentTypes.LOWERCASE]: (message, phrase) => {
                return phrase ? phrase.toLowerCase() : null;
            },
            [util_1.ArgumentTypes.UPPERCASE]: (message, phrase) => {
                return phrase ? phrase.toUpperCase() : null;
            },
            [util_1.ArgumentTypes.CHAR_CODES]: (message, phrase) => {
                if (!phrase)
                    return null;
                const codes = [];
                for (const char of phrase)
                    codes.push(char.charCodeAt(0));
                return codes;
            },
            [util_1.ArgumentTypes.NUMBER]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return parseFloat(phrase);
            },
            [util_1.ArgumentTypes.INTEGER]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return parseInt(phrase);
            },
            [util_1.ArgumentTypes.BIGINT]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return BigInt(phrase); // eslint-disable-line no-undef, new-cap
            },
            // Just for fun.
            [util_1.ArgumentTypes.EMOJINT]: (message, phrase) => {
                if (!phrase)
                    return null;
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
                if (isNaN(n))
                    return null;
                return parseInt(n);
            },
            [util_1.ArgumentTypes.URL]: (message, phrase) => {
                if (!phrase)
                    return null;
                if (/^<.+>$/.test(phrase))
                    phrase = phrase.slice(1, -1);
                try {
                    return new url_1.URL(phrase);
                }
                catch (err) {
                    return null;
                }
            },
            [util_1.ArgumentTypes.DATE]: (message, phrase) => {
                if (!phrase)
                    return null;
                const timestamp = Date.parse(phrase);
                if (isNaN(timestamp))
                    return null;
                return new Date(timestamp);
            },
            [util_1.ArgumentTypes.COLOR]: (message, phrase) => {
                if (!phrase)
                    return null;
                const color = parseInt(phrase.replace("#", ""), 16);
                if (color < 0 || color > 0xffffff || isNaN(color)) {
                    return null;
                }
                return color;
            },
            [util_1.ArgumentTypes.USER]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveUser(phrase, this.client.users);
            },
            [util_1.ArgumentTypes.USERS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const users = this.client.util.resolveUsers(phrase, this.client.users);
                return users.length ? users : null;
            },
            [util_1.ArgumentTypes.MEMBER]: (message, phrase) => {
                console.log("member");
                if (!phrase)
                    return null;
                return this.client.util.resolveMember(phrase, message.guild.members);
            },
            [util_1.ArgumentTypes.MEMBERS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const members = this.client.util.resolveMembers(phrase, message.guild.members);
                return members.length ? members : null;
            },
            [util_1.ArgumentTypes.CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveChannel(phrase, message.guild.channels);
            },
            [util_1.ArgumentTypes.CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                return channels.length ? channels : null;
            },
            [util_1.ArgumentTypes.TEXT_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 0)
                    return null;
                return channel;
            },
            [util_1.ArgumentTypes.TEXT_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const textChannels = channels.filter((c) => c.type === 0);
                return textChannels.length ? textChannels : null;
            },
            [util_1.ArgumentTypes.VOICE_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 2)
                    return null;
                return channel;
            },
            [util_1.ArgumentTypes.VOICE_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const voiceChannels = channels.filter((c) => c.type === 2);
                return voiceChannels.length ? voiceChannels : null;
            },
            [util_1.ArgumentTypes.CATEGORY_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                // @ts-ignore
                if (!channel || channel.type !== 4)
                    return null;
                return channel;
            },
            [util_1.ArgumentTypes.CATEGORY_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                // @ts-ignore
                const categoryChannels = channels.filter((c) => c.type === 4);
                return categoryChannels.length ? categoryChannels : null;
            },
            [util_1.ArgumentTypes.NEWS_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 5)
                    return null;
                return channel;
            },
            [util_1.ArgumentTypes.NEWS_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const newsChannels = channels.filter((c) => c.type === 5);
                return newsChannels.length ? newsChannels : null;
            },
            [util_1.ArgumentTypes.STORE_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                // @ts-ignore
                if (!channel || channel.type !== 6)
                    return null;
                return channel;
            },
            [util_1.ArgumentTypes.STORE_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                // @ts-ignore
                const storeChannels = channels.filter((c) => c.type === 6);
                return storeChannels.length ? storeChannels : null;
            },
            [util_1.ArgumentTypes.ROLE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveRole(phrase, message.guild.roles);
            },
            [util_1.ArgumentTypes.ROLES]: (message, phrase) => {
                if (!phrase)
                    return null;
                const roles = this.client.util.resolveRoles(phrase, message.guild.roles);
                return roles.length ? roles : null;
            },
            [util_1.ArgumentTypes.EMOJI]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveEmoji(phrase, message.guild.emojis);
            },
            [util_1.ArgumentTypes.EMOJIS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const emojis = this.client.util.resolveEmojis(phrase, message.guild.emojis);
                return emojis.length ? emojis : null;
            },
            [util_1.ArgumentTypes.GUILD]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveGuild(phrase, this.client.guilds);
            },
            [util_1.ArgumentTypes.GUILDS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const guilds = this.client.util.resolveGuilds(phrase, this.client.guilds);
                return guilds.length ? guilds : null;
            },
            [util_1.ArgumentTypes.MESSAGE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return message.channel.messages.get(phrase);
            },
            [util_1.ArgumentTypes.GUILD_MESSAGE]: async (message, phrase) => {
                if (!phrase)
                    return null;
                for (const channel of message.guild.channels.values()) {
                    if (channel.type !== eris_1.Constants.ChannelTypes.GUILD_TEXT)
                        continue;
                    try {
                        return await channel.messages.get(phrase);
                    }
                    catch (err) {
                        if (/^Invalid Form Body/.test(err.message))
                            return null;
                    }
                }
                return null;
            },
            [util_1.ArgumentTypes.RELEVANT_MESSAGE]: async (message, phrase) => {
                if (!phrase)
                    return null;
                const hereMsg = await message.channel.messages.get(phrase);
                if (hereMsg) {
                    return hereMsg;
                }
                if (message.guild) {
                    for (const channel of message.guild.channels.values()) {
                        if (channel.type !== eris_1.Constants.ChannelTypes.GUILD_TEXT)
                            continue;
                        try {
                            return await channel.messages.get(phrase);
                        }
                        catch (err) {
                            if (/^Invalid Form Body/.test(err.message))
                                return null;
                        }
                    }
                }
                return null;
            },
            [util_1.ArgumentTypes.INVITE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.getInvite(phrase).catch(() => null);
            },
            [util_1.ArgumentTypes.USER_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@!?(\d{17,19})>/);
                if (!id)
                    return null;
                return this.client.users.get(id[1]) || null;
            },
            [util_1.ArgumentTypes.MEMBER_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@!?(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.members.get(id[1]) || null;
            },
            [util_1.ArgumentTypes.CHANNEL_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<#(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.channels.get(id[1]) || null;
            },
            [util_1.ArgumentTypes.ROLE_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@&(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.roles.get(id[1]) || null;
            },
            [util_1.ArgumentTypes.EMOJI_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.emojis.find(e => e.id === id[1]) || null;
            },
            [util_1.ArgumentTypes.COMMAND_ALIAS]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.commands.findCommand(phrase) || null;
            },
            [util_1.ArgumentTypes.COMMAND]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.commands.parts.get(phrase) || null;
            },
            [util_1.ArgumentTypes.INHIBITOR]: (message, phrase) => {
                if (!phrase || !this.inhibitors)
                    return null;
                return this.inhibitors.parts.get(phrase) || null;
            },
            [util_1.ArgumentTypes.LISTENER]: (message, phrase) => {
                if (!phrase || !this.listeners)
                    return null;
                return this.listeners.parts.get(phrase) || null;
            },
        };
        for (const [key, value] of Object.entries(builtins)) {
            this.types.set(key, value);
        }
    }
    type(name) {
        return this.types.get(name);
    }
    addType(name, fn) {
        this.types.set(name, fn);
        return this;
    }
    addTypes(types) {
        for (const [key, value] of Object.entries(types)) {
            this.addType(key, value);
        }
        return this;
    }
}
exports.TypeResolver = TypeResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVJlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmQvYXJndW1lbnQvVHlwZVJlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0JBQTBDO0FBRTFDLHFDQUF1RDtBQUN2RCw2QkFBMEI7QUFFMUIsTUFBYSxZQUFZO0lBVXZCLFlBQW1CLE9BQXFCO1FBQXJCLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFSakMsVUFBSyxHQUEyQyxJQUFJLGlCQUFVLEVBQUUsQ0FBQztRQVN0RSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFckIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxlQUFlO1FBQ3BCLE1BQU0sUUFBUSxHQUF1QztZQUNuRCxDQUFDLG9CQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFnQixFQUFFLE1BQVcsRUFBRSxFQUFFO2dCQUN4RCxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUM7WUFDeEIsQ0FBQztZQUVELENBQUMsb0JBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQWdCLEVBQUUsTUFBVyxFQUFFLEVBQUU7Z0JBQzNELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM5QyxDQUFDO1lBRUQsQ0FBQyxvQkFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBZ0IsRUFBRSxNQUFXLEVBQUUsRUFBRTtnQkFDM0QsT0FBTyxNQUFNLENBQUMsQ0FBQyxD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