"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const path_1 = require("path");
const ClientUtil_1 = require("./util/ClientUtil");
const _1 = require(".");
const Permissions_1 = require("./util/eris/Permissions");
const logger_1 = require("@ayanaware/logger");
/**
 * The base class for creating a bot.
 * @extends Client
 * @since 1.0.0
 */
class BladeClient extends eris_1.Client {
    /**
     * Creates a new BladeClient.
     * @param options
     */
    constructor(options) {
        var _a;
        super(options.token, options);
        /**
         * A set of owners.
         */
        this.owners = new Set();
        /**
         * A set of stores that are being used by the client.
         * @since 1.0.0
         */
        this.stores = new _1.Collection();
        this.logger = logger_1.Logger.custom("blade", "@kyu", "");
        this.util = new ClientUtil_1.ClientUtil();
        this.directory = (_a = options.directory) !== null && _a !== void 0 ? _a : path_1.dirname(require.main.filename);
        this.languages = new _1.LanguageStore(this, options.language);
        this.started = false;
    }
    get invite() {
        const commands = this.stores.get("commands");
        if (!this.app || !commands)
            return null;
        const permissions = new eris_1.Permission(Permissions_1.Permissions.add(...BladeClient.basePermissions, ...commands.parts.map(c => c.permissionsBytecode)), 0);
        return `https://discordapp.com/oauth2/authorize?client_id=${this.app.id}&permissions=${permissions.allow}&scope=bot`;
    }
    /**
     * Starts the bot.
     * @since 1.0.0
     */
    async start() {
        this.once("ready", async () => {
            var _a;
            this.started = true;
            this.stores.forEach(s => s.parts.forEach(async (p) => await p.init(this)));
            for (const id of ((_a = this.options.owners) !== null && _a !== void 0 ? _a : []))
                this.owners.add(this.users.get(id));
        });
        await this.languages.loadAll();
        await Promise.all(this.stores.map(r => r.loadAll()));
        try {
            await this.connect();
        }
        catch (e) {
            throw e;
        }
        return this;
    }
    /**
     * Check if a member or user is an owner.
     * @param resolvable The member/user to check.
     * @since 1.0.0
     */
    isOwner(resolvable) {
        return this.owners.has(resolvable instanceof eris_1.User ? resolvable : resolvable.user);
    }
}
exports.BladeClient = BladeClient;
BladeClient.basePermissions = [eris_1.Constants.Permissions.sendMessages, eris_1.Constants.Permissions.readMessages];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUF3RztBQUd4RywrQkFBK0I7QUFDL0Isa0RBQStDO0FBQy9DLHdCQUFrRjtBQUNsRix5REFBc0Q7QUFDdEQsOENBQTJDO0FBUzNDOzs7O0dBSUc7QUFDSCxNQUFhLFdBQVksU0FBUSxhQUFNO0lBOENyQzs7O09BR0c7SUFDSCxZQUFtQixPQUFxQjs7UUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFuQmhDOztXQUVHO1FBQ0ksV0FBTSxHQUFjLElBQUksR0FBRyxFQUFFLENBQUM7UUFLckM7OztXQUdHO1FBQ2EsV0FBTSxHQUFvQyxJQUFJLGFBQVUsRUFBRSxDQUFDO1FBU3pFLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUE7UUFDNUIsSUFBSSxDQUFDLFNBQVMsU0FBRyxPQUFPLENBQUMsU0FBUyxtQ0FBSSxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksZ0JBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQWlCLENBQUM7UUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBVSxDQUFDLHlCQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLGVBQWUsRUFBRSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxSSxPQUFPLHFEQUFxRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0JBQWdCLFdBQVcsQ0FBQyxLQUFLLFlBQVksQ0FBQztJQUN2SCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLEtBQUs7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7O1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6RSxLQUFLLE1BQU0sRUFBRSxJQUFJLE9BQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLG1DQUFJLEVBQUUsQ0FBQztnQkFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckQsSUFBSTtZQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3RCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLENBQUMsQ0FBQztTQUNUO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE9BQU8sQ0FBQyxVQUF5QjtRQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsWUFBWSxXQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25GLENBQUM7O0FBbkdILGtDQW9HQztBQW5HZSwyQkFBZSxHQUFHLENBQUUsZ0JBQVMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLGdCQUFTLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBRSxDQUFDIn0=