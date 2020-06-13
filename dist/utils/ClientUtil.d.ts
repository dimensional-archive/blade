import { Collection, Emoji, Guild, Member, Message, Role, TextableChannel, TextChannel, User, VoiceChannel } from "eris";
import { Storage } from "..";
import { MessageCollectorOptions } from "./collectors/MessageCollector";
declare type Channel = TextChannel | VoiceChannel;
export declare class ClientUtil {
    resolveUser(text: string, users: Collection<User>, caseSensitive?: boolean, wholeWord?: boolean): User | undefined;
    resolveUsers(text: string, users: Collection<User>, caseSensitive?: boolean, wholeWord?: boolean): User[];
    checkUser(text: string, user: User, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    resolveMember(text: string, members: Collection<Member>, caseSensitive?: boolean, wholeWord?: boolean): Member | undefined;
    resolveMembers(text: string, members: Collection<Member>, caseSensitive?: boolean, wholeWord?: boolean): Member[];
    checkMember(text: string, member: Member, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    resolveChannel(text: string, channels: Collection<any>, caseSensitive?: boolean, wholeWord?: boolean): Channel | undefined;
    resolveChannels(text: string, channels: Collection<any>, caseSensitive?: boolean, wholeWord?: boolean): Channel[];
    checkChannel(text: string, channel: Channel, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    resolveRole(text: string, roles: Collection<Role>, caseSensitive?: boolean, wholeWord?: boolean): Role | undefined;
    resolveRoles(text: string, roles: Collection<Role>, caseSensitive?: boolean, wholeWord?: boolean): Role[];
    checkRole(text: string, role: Role, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    resolveEmoji(text: string, emojis: Emoji[], caseSensitive?: boolean, wholeWord?: boolean): Emoji;
    resolveEmojis(text: string, emojis: Emoji[], caseSensitive?: boolean, wholeWord?: boolean): Emoji[];
    checkEmoji(text: string, emoji: Emoji, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    resolveGuild(text: string, guilds: Collection<Guild>, caseSensitive?: boolean, wholeWord?: boolean): Guild | undefined;
    resolveGuilds(text: string, guilds: Collection<Guild>, caseSensitive?: boolean, wholeWord?: boolean): Guild[];
    checkGuild(text: string, guild: Guild, caseSensitive?: boolean, wholeWord?: boolean): boolean;
    awaitMessages(channel: TextableChannel, options: MessageCollectorOptions): Promise<Storage<string, Message>>;
}
export {};
