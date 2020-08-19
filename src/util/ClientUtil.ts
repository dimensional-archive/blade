import type { Channel, Guild, GuildBasedChannel, GuildEmoji, Member, Role, Store, User } from "@kyudiscord/neo";

export class ClientUtil {
  public resolveUser(s: string, u: S<User>, cs = false, w = false): User | undefined {
    return u.get(s) ?? u.find((user) => this.checkUser(s, user, cs, w));
  }

  public resolveUsers(t: string, u: S<User>, cs = false, w = false): S<User> {
    return u.filter((user) => this.checkUser(t, user, cs, w));
  }

  /**
   * Check whether or not a user matches a user.
   */
  public checkUser(t: string, u: User, cs = false, w = false): boolean {
    if (u.id === t) return true;

    const r = /<@!?(\d{17,19})>/;
    const m = t.match(r);
    if (m && u.id === m[1]) return true;

    t = cs ? t : t.toLowerCase();
    const un = cs ? u.username : u.username.toLowerCase();
    const d = u.discriminator;

    return w
      ? (un === t || (un === t.split("#")[0] && d === t.split("#")[1]))
      : (un.includes(t) || (un.includes(t.split("#")[0]) && d.includes(t.split("#")[1])));
  }

  public resolveMember(t: string, m: S<Member>, cs = false, w = false): Member | undefined {
    return m.get(t) ?? m.find(m1 => this.checkMember(t, m1, cs, w));
  }

  public resolveMembers(t: string, m: S<Member>, cs = false, w = false): S<Member> {
    return m.filter(m1 => this.checkMember(t, m1, cs, w));
  }

  /**
   * Check whether or not a member matches a string.
   */
  public checkMember(t: string, m: Member, cs = false, w = false): boolean {
    if (m.id === t) return true;

    const r = /<@!?(\d{17,19})>/;
    const m1 = t.match(r);

    if (m1 && m.id === m1[1]) return true;

    t = cs ? t : t.toLowerCase();
    const un = cs ? m.user.username : m.user.username.toLowerCase();
    const dn = cs ? m.displayName : m.displayName.toLowerCase();
    const d = m.user.discriminator;

    if (!w) {
      return (
        dn.includes(t)
        || un.includes(t)
        || ((un.includes(t.split("#")[0]) || dn.includes(t.split("#")[0])) && d.includes(t.split("#")[1]))
      );
    }

    return (dn === t || un === t || ((un === t.split("#")[0] || dn === t.split("#")[0]) && d === t.split("#")[1]));
  }

  public resolveRole(t: string, r: S<Role>, cs = false, w = false): Role | undefined {
    return r.get(t) ?? r.find((r1) => this.checkRole(t, r1, cs, w));
  }

  public resolveRoles(t: string, r: S<Role>, cs = false, w = false): S<Role> {
    return r.filter((r1) => this.checkRole(t, r1, cs, w));
  }

  /**
   * Check whether or not a role matches a string.
   */
  public checkRole(t: string, r: Role, cs = false, w = false): boolean {
    if (r.id === t) return true;

    const rg = /<@&(\d{17,19})>/;
    const m = t.match(rg);
    if (m && r.id === m[1]) return true;

    t = cs ? t : t.toLowerCase();
    const n = cs ? r.name : r.name.toLowerCase();

    return w
      ? n === t || n === t.replace(/^@/, "")
      : n.includes(t) || n.includes(t.replace(/^@/, ""));
  }

  public resolveEmoji(t: string, e: S<GuildEmoji>, es = false, w = false): GuildEmoji | undefined {
    return e.get(t) ?? e.find((e1) => this.checkEmoji(t, e1, es, w));
  }

  public resolveEmojis(t: string, e: S<GuildEmoji>, cs = false, w = false): S<GuildEmoji> {
    return e.filter((e1) => this.checkEmoji(t, e1, cs, w));
  }

  public checkEmoji(t: string, e: GuildEmoji, cs = false, w = false): boolean {
    if (e.id === t) return true;

    const r = /<a?:[a-zA-Z0-9_]+:(\d{17,19})>/;
    const m = t.match(r);
    if (m && e.id === m[1]) return true;

    t = cs ? t : t.toLowerCase();
    const n = cs ? e.name! : e.name!.toLowerCase();

    return w
      ? n === t || n === t.replace(/:/, "")
      : n.includes(t) || n.includes(t.replace(/:/, ""));
  }

  public resolveChannel(t: string, c: S<GuildBasedChannel>, cs = false, w = false): Channel | undefined {
    return c.get(t) ?? c.find((c1) => this.checkChannel(t, c1, cs, w));
  }

  public resolveChannels(t: string, c: S<GuildBasedChannel>, cs = false, w = false): S<Channel> {
    return c.filter((c1) => this.checkChannel(t, c1, cs, w));
  }

  public checkChannel(t: string, c: GuildBasedChannel, cs = false, w = false): boolean {
    if (c.id === t) return true;

    const r = /<#(\d{17,19})>/;
    const m = t.match(r);
    if (m && c.id === m[1]) return true;

    t = cs ? t : t.toLowerCase();
    const n = cs ? c.name : c.name.toLowerCase();

    return w
      ? n === t || n === t.replace(/^#/, "")
      : n.includes(t) || n.includes(t.replace(/^#/, ""));
  }

  public resolveGuild(t: string, g: S<Guild>, cs = false, w = false): Guild | undefined {
    return g.get(t) ?? g.find((g1) => this.checkGuild(t, g1, cs, w));
  }

  public resolveGuilds(t: string, g: S<Guild>, cs = false, w = false): S<Guild> {
    return g.filter((g1) => this.checkGuild(t, g1, cs, w));
  }

  public checkGuild(t: string, g: Guild, cs = false, w = false): boolean {
    if (g.id === t) return true;

    t = cs ? t : t.toLowerCase();
    const n = cs ? g.name : g.name.toLowerCase();

    return w ? n === t : n.includes(t);
  }
}

type S<T> = Store<string, T>
