"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BladeClient = void 0;
const eris_1 = require("eris");
const errors_1 = require("@ayanaware/errors");
const path_1 = require("path");
const ClientUtil_1 = require("../utils/ClientUtil");
const __1 = require("..");
const Permissions_1 = __importDefault(require("../utils/Permissions"));
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
        this._stores = new __1.Storage();
        this.languages = new __1.LanguageHelper(this, options.language);
        this.logger = logger_1.Logger.custom("blade", "@kyu", "");
        this.util = new ClientUtil_1.ClientUtil();
        this.directory = (_a = options.directory) !== null && _a !== void 0 ? _a : path_1.dirname(require.main.filename);
        this.started = false;
    }
    get invite() {
        const commands = this._stores.get("commands");
        if (!this.app || !commands)
            return null;
        const permissions = new eris_1.Permission(Permissions_1.default.add(...BladeClient.basePermissions, ...commands.components.map(c => c.permissionsBytecode)), 0);
        return `https://discordapp.com/oauth2/authorize?client_id=${this.app.id}&permissions=${permissions.allow}&scope=bot`;
    }
    /**
     * Uses a store.
     * @param store The store to use.
     */
    use(store) {
        var _a;
        if (this._stores.has(store.name)) {
            throw new errors_1.IllegalStateError(`Store "${(_a = store.name) !== null && _a !== void 0 ? _a : store.constructor.name}" is already being used.`);
        }
        this._stores.set(store.name, store);
        Object.defineProperty(this, store.name, { value: store });
        if (this.started)
            store.loadAll().then(() => true);
        return this;
    }
    /**
     * Starts the bot.
     * @since 1.0.0
     */
    async start() {
        this.once("ready", async () => {
            var _a;
            this.started = true;
            this._stores.forEach(s => s.components.forEach(async (p) => await p.init(this)));
            for (const id of ((_a = this.options.owners) !== null && _a !== void 0 ? _a : []))
                this.owners.add(this.users.get(id));
        });
        await this.languages.loadAll();
        await Promise.all(this._stores.map(r => r.loadAll()));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9DbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQXdHO0FBR3hHLDhDQUFzRDtBQUN0RCwrQkFBK0I7QUFDL0Isb0RBQWlEO0FBQ2pELDBCQUFrRjtBQUNsRix1RUFBK0M7QUFDL0MsOENBQTJDO0FBUzNDOzs7O0dBSUc7QUFDSCxNQUFhLFdBQVksU0FBUSxhQUFNO0lBOENyQzs7O09BR0c7SUFDSCxZQUFtQixPQUEyQjs7UUFDNUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFuQmhDOztXQUVHO1FBQ0ksV0FBTSxHQUFjLElBQUksR0FBRyxFQUFFLENBQUM7UUFLckM7OztXQUdHO1FBQ2MsWUFBTyxHQUErQyxJQUFJLFdBQU8sRUFBRSxDQUFDO1FBU25GLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxrQkFBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQTtRQUM1QixJQUFJLENBQUMsU0FBUyxTQUFHLE9BQU8sQ0FBQyxTQUFTLG1DQUFJLGNBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFXLE1BQU07UUFDZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQWlCLENBQUM7UUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRO1lBQUUs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