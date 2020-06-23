"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeResolver = void 0;
const __1 = require("../../../..");
const Constants_1 = require("../../../../utils/Constants");
const url_1 = require("url");
const eris_1 = require("eris");
class TypeResolver {
    constructor(handler) {
        this.handler = handler;
        this.types = new __1.Storage();
        this.client = handler.client;
        this.commands = handler;
        this.inhibitors = null;
        this.listeners = null;
        this.monitors = null;
        this.addBuiltInTypes();
    }
    addBuiltInTypes() {
        const builtins = {
            [Constants_1.ArgumentTypes.STRING]: (message, phrase) => {
                return phrase || null;
            },
            [Constants_1.ArgumentTypes.LOWERCASE]: (message, phrase) => {
                return phrase ? phrase.toLowerCase() : null;
            },
            [Constants_1.ArgumentTypes.UPPERCASE]: (message, phrase) => {
                return phrase ? phrase.toUpperCase() : null;
            },
            [Constants_1.ArgumentTypes.CHAR_CODES]: (message, phrase) => {
                if (!phrase)
                    return null;
                const codes = [];
                for (const char of phrase)
                    codes.push(char.charCodeAt(0));
                return codes;
            },
            [Constants_1.ArgumentTypes.NUMBER]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return parseFloat(phrase);
            },
            [Constants_1.ArgumentTypes.INTEGER]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return parseInt(phrase);
            },
            [Constants_1.ArgumentTypes.BIGINT]: (message, phrase) => {
                if (!phrase || isNaN(phrase))
                    return null;
                return BigInt(phrase); // eslint-disable-line no-undef, new-cap
            },
            // Just for fun.
            [Constants_1.ArgumentTypes.EMOJINT]: (message, phrase) => {
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
            [Constants_1.ArgumentTypes.URL]: (message, phrase) => {
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
            [Constants_1.ArgumentTypes.DATE]: (message, phrase) => {
                if (!phrase)
                    return null;
                const timestamp = Date.parse(phrase);
                if (isNaN(timestamp))
                    return null;
                return new Date(timestamp);
            },
            [Constants_1.ArgumentTypes.COLOR]: (message, phrase) => {
                if (!phrase)
                    return null;
                const color = parseInt(phrase.replace("#", ""), 16);
                if (color < 0 || color > 0xffffff || isNaN(color)) {
                    return null;
                }
                return color;
            },
            [Constants_1.ArgumentTypes.USER]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveUser(phrase, this.client.users);
            },
            [Constants_1.ArgumentTypes.USERS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const users = this.client.util.resolveUsers(phrase, this.client.users);
                return users.length ? users : null;
            },
            [Constants_1.ArgumentTypes.MEMBER]: (message, phrase) => {
                console.log("member");
                if (!phrase)
                    return null;
                return this.client.util.resolveMember(phrase, message.guild.members);
            },
            [Constants_1.ArgumentTypes.MEMBERS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const members = this.client.util.resolveMembers(phrase, message.guild.members);
                return members.length ? members : null;
            },
            [Constants_1.ArgumentTypes.CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveChannel(phrase, message.guild.channels);
            },
            [Constants_1.ArgumentTypes.CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                return channels.length ? channels : null;
            },
            [Constants_1.ArgumentTypes.TEXT_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 0)
                    return null;
                return channel;
            },
            [Constants_1.ArgumentTypes.TEXT_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const textChannels = channels.filter((c) => c.type === 0);
                return textChannels.length ? textChannels : null;
            },
            [Constants_1.ArgumentTypes.VOICE_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 2)
                    return null;
                return channel;
            },
            [Constants_1.ArgumentTypes.VOICE_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const voiceChannels = channels.filter((c) => c.type === 2);
                return voiceChannels.length ? voiceChannels : null;
            },
            [Constants_1.ArgumentTypes.CATEGORY_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                // @ts-ignore
                if (!channel || channel.type !== 4)
                    return null;
                return channel;
            },
            [Constants_1.ArgumentTypes.CATEGORY_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                // @ts-ignore
                const categoryChannels = channels.filter((c) => c.type === 4);
                return categoryChannels.length ? categoryChannels : null;
            },
            [Constants_1.ArgumentTypes.NEWS_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                if (!channel || channel.type !== 5)
                    return null;
                return channel;
            },
            [Constants_1.ArgumentTypes.NEWS_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                const newsChannels = channels.filter((c) => c.type === 5);
                return newsChannels.length ? newsChannels : null;
            },
            [Constants_1.ArgumentTypes.STORE_CHANNEL]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channel = this.client.util.resolveChannel(phrase, message.guild.channels);
                // @ts-ignore
                if (!channel || channel.type !== 6)
                    return null;
                return channel;
            },
            [Constants_1.ArgumentTypes.STORE_CHANNELS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const channels = this.client.util.resolveChannels(phrase, message.guild.channels);
                if (!channels.length)
                    return null;
                // @ts-ignore
                const storeChannels = channels.filter((c) => c.type === 6);
                return storeChannels.length ? storeChannels : null;
            },
            [Constants_1.ArgumentTypes.ROLE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveRole(phrase, message.guild.roles);
            },
            [Constants_1.ArgumentTypes.ROLES]: (message, phrase) => {
                if (!phrase)
                    return null;
                const roles = this.client.util.resolveRoles(phrase, message.guild.roles);
                return roles.length ? roles : null;
            },
            [Constants_1.ArgumentTypes.EMOJI]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveEmoji(phrase, message.guild.emojis);
            },
            [Constants_1.ArgumentTypes.EMOJIS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const emojis = this.client.util.resolveEmojis(phrase, message.guild.emojis);
                return emojis.length ? emojis : null;
            },
            [Constants_1.ArgumentTypes.GUILD]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.util.resolveGuild(phrase, this.client.guilds);
            },
            [Constants_1.ArgumentTypes.GUILDS]: (message, phrase) => {
                if (!phrase)
                    return null;
                const guilds = this.client.util.resolveGuilds(phrase, this.client.guilds);
                return guilds.length ? guilds : null;
            },
            [Constants_1.ArgumentTypes.MESSAGE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return message.channel.messages.get(phrase);
            },
            [Constants_1.ArgumentTypes.GUILD_MESSAGE]: async (message, phrase) => {
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
            [Constants_1.ArgumentTypes.RELEVANT_MESSAGE]: async (message, phrase) => {
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
            [Constants_1.ArgumentTypes.INVITE]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.client.getInvite(phrase).catch(() => null);
            },
            [Constants_1.ArgumentTypes.USER_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@!?(\d{17,19})>/);
                if (!id)
                    return null;
                return this.client.users.get(id[1]) || null;
            },
            [Constants_1.ArgumentTypes.MEMBER_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@!?(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.members.get(id[1]) || null;
            },
            [Constants_1.ArgumentTypes.CHANNEL_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<#(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.channels.get(id[1]) || null;
            },
            [Constants_1.ArgumentTypes.ROLE_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<@&(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.roles.get(id[1]) || null;
            },
            [Constants_1.ArgumentTypes.EMOJI_MENTION]: (message, phrase) => {
                if (!phrase)
                    return null;
                const id = phrase.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/);
                if (!id)
                    return null;
                return message.guild.emojis.find(e => e.id === id[1]) || null;
            },
            [Constants_1.ArgumentTypes.COMMAND_ALIAS]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.commands.findCommand(phrase) || null;
            },
            [Constants_1.ArgumentTypes.COMMAND]: (message, phrase) => {
                if (!phrase)
                    return null;
                return this.commands.components.get(phrase) || null;
            },
            [Constants_1.ArgumentTypes.INHIBITOR]: (message, phrase) => {
                if (!phrase || !this.inhibitors)
                    return null;
                return this.inhibitors.components.get(phrase) || null;
            },
            [Constants_1.ArgumentTypes.LISTENER]: (message, phrase) => {
                if (!phrase || !this.listeners)
                    return null;
                return this.listeners.components.get(phrase) || null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVJlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9jb21wb25lbnRzL2NvbW1hbmQvYXJndW1lbnQvVHlwZVJlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUE4RztBQUM5RywyREFBNEQ7QUFDNUQsNkJBQTBCO0FBQzFCLCtCQUEwQztBQUUxQyxNQUFhLFlBQVk7SUFVdkIsWUFBbUIsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQVJqQyxVQUFLLEdBQXdDLElBQUksV0FBTyxFQUFFLENBQUM7UUFTaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXJCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sZUFBZTtRQUNwQixNQUFNLFFBQVEsR0FBdUM7WUFDbkQsQ0FBQyx5QkFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBZ0IsRUFBRSxNQUFXLEVBQUUsRUFBRTtnQkFDeEQsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDO1lBQ3hCLENBQUM7WUFFRCxDQUFDLHlCQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxPQUFnQixFQUFFLE1BQVcsRUFBRSxFQUFFO2dCQUMzRCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUMsQ0FBQztZQUVELENBQUMseUJBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQWdCLEVBQUUsTUFBVyxFQUFF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