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