import { Client, ClientOptions, Constants, Member, OAuthApplicationInfo, Permission, User } from "eris";
import { Store } from "./structures/base/Store";
import { Part } from "./structures/base/Part";
import { dirname } from "path";
import { ClientUtil } from "./util/ClientUtil";
import { CommandStore, LanguageHelper, LanguageHelperOptions, Collection } from ".";
import { Permissions } from "./util/eris/Permissions";
import { Logger } from "@ayanaware/logger";

export interface BladeOptions extends ClientOptions {
  directory?: string;
  token: string;
  owners?: string | string[];
  language?: LanguageHelperOptions;
}

/**
 * The base class for creating a bot.
 * @extends Client
 * @since 1.0.0
 */
export class BladeClient extends Client {
  public static basePermissions = [ Constants.Permissions.sendMessages, Constants.Permissions.readMessages ];
  /**
   * This client's language helper.
   * @since 1.0.5
   */
  public readonly languages: LanguageHelper;
  /**
   * This client's logger.
   * @since 1.0.4
   */
  public readonly logger: Logger;
  /**
   * A utility class for resolving different classes like Emoji and Member.
   * @since 1.0.0
   */
  public readonly util: ClientUtil;
  /**
   * Oauth2 Application Info.
   * @since 1.0.0
   */
  public app?: OAuthApplicationInfo;
  /**
   * The base directory of the bot.
   * @since 1.0.0
   */
  public directory: string;
  /**
   * Whether the client has been started or not.
   * @since 1.0.0
   */
  public started: boolean;
  /**
   * A set of owners.
   */
  public owners: Set<User> = new Set();
  /**
   * The options that were given to this client.
   */
  public options!: BladeOptions;
  /**
   * A set of stores that are being used by the client.
   * @since 1.0.0
   */
  public readonly stores: Collection<string, Store<Part>> = new Collection();

  /**
   * Creates a new BladeClient.
   * @param options
   */
  public constructor(options: BladeOptions) {
    super(options.token, options);

    this.logger = Logger.custom("blade", "@kyu", "");
    this.util = new ClientUtil()
    this.directory = options.directory ?? dirname(require.main!.filename);
    this.languages = new LanguageHelper(this, options.language);
    this.started = false;
  }

  public get invite(): string | null {
    const commands = this.stores.get("commands") as CommandStore;
    if (!this.app || !commands) return null;

    const permissions = new Permission(Permissions.add(...BladeClient.basePermissions, ...commands.parts.map(c => c.permissionsBytecode)), 0);
    return `https://discordapp.com/oauth2/authorize?client_id=${this.app.id}&permissions=${permissions.allow}&scope=bot`;
  }

  /**
   * Starts the bot.
   * @since 1.0.0
   */
  public async start(): Promise<this> {
    this.once("ready", async () => {
      this.started = true;
      this.stores.forEach(s => s.parts.forEach(async p => await p.init(this)));

      for (const id of (this.options.owners ?? [])) this.owners.add(this.users.get(id)!);
    });

    await this.languages.loadAll();
    await Promise.all(this.stores.map(r => r.loadAll()));

    try {
      await this.connect();
    } catch (e) {
      throw e;
    }

    return this;
  }

  /**
   * Check if a member or user is an owner.
   * @param resolvable The member/user to check.
   * @since 1.0.0
   */
  public isOwner(resolvable: User | Member): boolean {
    return this.owners.has(resolvable instanceof User ? resolvable : resolvable.user)
  }
}