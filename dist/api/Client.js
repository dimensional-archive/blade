"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const path_1 = require("path");
const ClientUtil_1 = require("../utils/ClientUtil");
const __1 = require("..");
const Permissions_1 = require("../utils/Permissions");
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
        this.stores = new __1.Storage();
        this.languages = new __1.LanguageHelper(this, options.language);
        this.logger = logger_1.Logger.custom("blade", "@kyu", "");
        this.util = new ClientUtil_1.ClientUtil();
        this.directory = (_a = options.directory) !== null && _a !== void 0 ? _a : path_1.dirname(require.main.filename);
        this.started = false;
    }
    get invite() {
        const commands = this.stores.get("commands");
        if (!this.app || !commands)
            return null;
        const permissions = new eris_1.Permission(Permissions_1.Permissions.add(...BladeClient.basePermissions, ...commands.components.map(c => c.permissionsBytecode)), 0);
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
            this.stores.forEach(s => s.components.forEach(async (p) => await p.init(this)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9DbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBd0c7QUFHeEcsK0JBQStCO0FBQy9CLG9EQUFpRDtBQUNqRCwwQkFBa0Y7QUFDbEYsc0RBQW1EO0FBQ25ELDhDQUEyQztBQVMzQzs7OztHQUlHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsYUFBTTtJQThDckM7OztPQUdHO0lBQ0gsWUFBbUIsT0FBMkI7O1FBQzVDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBbkJoQzs7V0FFRztRQUNJLFdBQU0sR0FBYyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBS3JDOzs7V0FHRztRQUNhLFdBQU0sR0FBK0MsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQVNqRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksa0JBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUE7UUFDNUIsSUFBSSxDQUFDLFNBQVMsU0FBRyxPQUFPLENBQUMsU0FBUyxtQ0FBSSxjQUFPLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBVyxNQUFNO1FBQ2YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFpQixDQUFDO1FBQzdELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXhDLE1BQU0sV0FBVyxHQUFHLElBQUksaUJBQVUsQ0FBQyx5QkFBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxlQUFlLEVBQUUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0ksT0FBTyxxREFBcUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGdCQUFnQixXQUFXLENBQUMsS0FBSyxZQUFZLENBQUM7SUFDdkgsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFOztZQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUUsS0FBSyxNQUFNLEVBQUUsSUFBSSxPQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUM7Z0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXJELElBQUk7WUFDRixNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN0QjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsTUFBTSxDQUFDLENBQUM7U0FDVDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxPQUFPLENBQUMsVUFBeUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLFlBQVksV0FBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNuRixDQUFDOztBQW5HSCxrQ0FvR0M7QUFuR2UsMkJBQWUsR0FBRyxDQUFFLGdCQUFTLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxnQkFBUyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUUsQ0FBQyJ9