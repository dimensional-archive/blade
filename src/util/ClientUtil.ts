import {
  Emoji,
  Guild,
  Member,
  Message,
  Role,
  TextableChannel,
  GuildChannel,
  User,
  Collection as Col,
} from "eris";
import { MessageCollector, MessageCollectorOptions } from "./eris/MessageCollector";
import { Collection } from "./Storage";

export class ClientUtil {
  public resolveUser(
    text: string,
    users: Col<User>,
    caseSensitive = false,
    wholeWord = false
  ): User | undefined {
    return (
      users.get(text) ||
      users.find((user) => this.checkUser(text, user, caseSensitive, wholeWord))
    );
  }

  public resolveUsers(
    text: string,
    users: Col<User>,
    caseSensitive = false,
    wholeWord = false
  ): User[] {
    return users.filter((user) =>
      this.checkUser(text, user, caseSensitive, wholeWord)
    );
  }

  public checkUser(
    text: string,
    user: User,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (user.id === text) return true;

    const reg = /<@!?(\d{17,19})>/;
    const match = text.match(reg);

    if (match && user.id === match[1]) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const username = caseSensitive
      ? user.username
      : user.username.toLowerCase();
    const discrim = user.discriminator;

    if (!wholeWord) {
      return (
        username.includes(text) ||
        (username.includes(text.split("#")[0]) &&
          discrim.includes(text.split("#")[1]))
      );
    }

    return (
      username === text ||
      (username === text.split("#")[0] && discrim === text.split("#")[1])
    );
  }

  public resolveMember(
    text: string,
    members: Col<Member>,
    caseSensitive = false,
    wholeWord = false
  ): Member | undefined {
    return (
      members.get(text) ||
      members.find((member) =>
        this.checkMember(text, member, caseSensitive, wholeWord)
      )
    );
  }

  public resolveMembers(
    text: string,
    members: Col<Member>,
    caseSensitive = false,
    wholeWord = false
  ): Member[] {
    return members.filter((member) =>
      this.checkMember(text, member, caseSensitive, wholeWord)
    );
  }

  public checkMember(
    text: string,
    member: Member,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (member.id === text) return true;

    const reg = /<@!?(\d{17,19})>/;
    const match = text.match(reg);

    if (match && member.id === match[1]) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const _displayName = member.nick ?? member.username;
    const username = caseSensitive
      ? member.user.username
      : member.user.username.toLowerCase();
    const displayName = caseSensitive
      ? _displayName
      : _displayName.toLowerCase();
    const discrim = member.user.discriminator;

    if (!wholeWord) {
      return (
        displayName.includes(text) ||
        username.includes(text) ||
        ((username.includes(text.split("#")[0]) ||
          displayName.includes(text.split("#")[0])) &&
          discrim.includes(text.split("#")[1]))
      );
    }

    return (
      displayName === text ||
      username === text ||
      ((username === text.split("#")[0] ||
        displayName === text.split("#")[0]) &&
        discrim === text.split("#")[1])
    );
  }

  public resolveChannel(
    text: string,
    channels: Col<any>,
    caseSensitive = false,
    wholeWord = false
  ): GuildChannel | undefined {
    return (
      channels.get(text) ||
      channels.find((channel) =>
        this.checkChannel(text, channel, caseSensitive, wholeWord)
      )
    );
  }

  public resolveChannels(
    text: string,
    channels: Col<any>,
    caseSensitive = false,
    wholeWord = false
  ): GuildChannel[] {
    return channels.filter((channel) =>
      this.checkChannel(text, channel, caseSensitive, wholeWord)
    );
  }

  public checkChannel(
    text: string,
    channel: GuildChannel,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (channel.id === text) return true;

    const reg = /<#(\d{17,19})>/;
    const match = text.match(reg);

    if (match && channel.id === match[1]) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const name = caseSensitive ? channel.name : channel.name.toLowerCase();

    if (!wholeWord) {
      return name.includes(text) || name.includes(text.replace(/^#/, ""));
    }

    return name === text || name === text.replace(/^#/, "");
  }

  public resolveRole(
    text: string,
    roles: Col<Role>,
    caseSensitive = false,
    wholeWord = false
  ): Role | undefined {
    return (
      roles.get(text) ||
      roles.find((role) => this.checkRole(text, role, caseSensitive, wholeWord))
    );
  }

  public resolveRoles(
    text: string,
    roles: Col<Role>,
    caseSensitive = false,
    wholeWord = false
  ): Role[] {
    return roles.filter((role) =>
      this.checkRole(text, role, caseSensitive, wholeWord)
    );
  }

  public checkRole(
    text: string,
    role: Role,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (role.id === text) return true;

    const reg = /<@&(\d{17,19})>/;
    const match = text.match(reg);

    if (match && role.id === match[1]) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const name = caseSensitive ? role.name : role.name.toLowerCase();

    if (!wholeWord) {
      return name.includes(text) || name.includes(text.replace(/^@/, ""));
    }

    return name === text || name === text.replace(/^@/, "");
  }

  public resolveEmoji(
    text: string,
    emojis: Emoji[],
    caseSensitive = false,
    wholeWord = false
  ): Emoji {
    return (
      emojis[text] ||
      emojis.find((emoji) =>
        this.checkEmoji(text, emoji, caseSensitive, wholeWord)
      )
    );
  }

  public resolveEmojis(
    text: string,
    emojis: Emoji[],
    caseSensitive = false,
    wholeWord = false
  ): Emoji[] {
    return emojis.filter((emoji) =>
      this.checkEmoji(text, emoji, caseSensitive, wholeWord)
    );
  }

  public checkEmoji(
    text: string,
    emoji: Emoji,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (emoji.id === text) return true;

    const reg = /<a?:[a-zA-Z0-9_]+:(\d{17,19})>/;
    const match = text.match(reg);

    if (match && emoji.id === match[1]) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const name = caseSensitive ? emoji.name : emoji.name.toLowerCase();

    if (!wholeWord) {
      return name.includes(text) || name.includes(text.replace(/:/, ""));
    }

    return name === text || name === text.replace(/:/, "");
  }

  public resolveGuild(
    text: string,
    guilds: Col<Guild>,
    caseSensitive = false,
    wholeWord = false
  ): Guild | undefined {
    return (
      guilds.get(text) ||
      guilds.find((guild) =>
        this.checkGuild(text, guild, caseSensitive, wholeWord)
      )
    );
  }

  public resolveGuilds(
    text: string,
    guilds: Col<Guild>,
    caseSensitive = false,
    wholeWord = false
  ): Guild[] {
    return guilds.filter((guild) =>
      this.checkGuild(text, guild, caseSensitive, wholeWord)
    );
  }

  public checkGuild(
    text: string,
    guild: Guild,
    caseSensitive = false,
    wholeWord = false
  ): boolean {
    if (guild.id === text) return true;

    text = caseSensitive ? text : text.toLowerCase();
    const name = caseSensitive ? guild.name : guild.name.toLowerCase();

    if (!wholeWord) return name.includes(text);
    return name === text;
  }

  public awaitMessages(channel: TextableChannel, options: MessageCollectorOptions): Promise<Collection<string, Message>> {
    return new MessageCollector(channel, options).collect();
  }
}