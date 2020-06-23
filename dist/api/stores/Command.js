"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreDefinedReason = exports.CommandStoreEvents = exports.CommandStore = void 0;
const Base_1 = require("./Base");
const __1 = require("../..");
const Permissions_1 = __importDefault(require("../../utils/Permissions"));
const eris_1 = require("eris");
const command_1 = require("../components/command/");
const errors_1 = require("@ayanaware/errors");
/**
 * A command store that handles loading of commands.
 */
class CommandStore extends Base_1.ComponentStore {
    /**
     * Creates a new Command Store
     * @param client The client that is using this command store.
     * @param options The options to give.
     */
    constructor(client, options = {}) {
        var _a, _b;
        super(client, "commands", {
            ...options,
            classToHandle: command_1.Command
        });
        /**
         * An alias storage.
         * @since 1.0.0
         */
        this.aliases = new __1.Storage();
        /**
         * A prefix storage.
         */
        this.prefixes = new __1.Storage();
        /**
         * A map of cooldowns.
         * @since 1.0.0
         */
        this.cooldowns = new WeakMap();
        /**
         * A storage for prompts.
         * @since 1.0.0
         * @readonly
         */
        this.promptStorage = new __1.Storage();
        /**
         * A storage for contexts.
         * @since 1.0.0
         * @readonly
         */
        this.contextStorage = new __1.Storage();
        this.types = new __1.TypeResolver(this);
        this.handling = __1.Util.deepAssign({
            allowBots: false,
            allowSelf: false,
            allowUsers: true,
            enabled: true,
            ignoreCooldown: "",
            ignorePermissions: "",
            storeMessages: true,
            handleEdits: true,
            sendTyping: true,
            prefix: ["!"],
            getLanguage: () => "en-US",
            argumentDefaults: {
                prompt: {
                    start: "",
                    retry: "",
                    timeout: "",
                    ended: "",
                    cancel: "",
                    retries: 1,
                    time: 30000,
                    cancelWord: "cancel",
                    stopWord: "stop",
                    optional: false,
                    infinite: false,
                    limit: Infinity,
                    breakout: true,
                },
            }
        }, (_a = options.handling) !== null && _a !== void 0 ? _a : {});
        this.defaultCooldown = (_b = options.defaultCooldown) !== null && _b !== void 0 ? _b : 5000;
        if (this.handling.enabled) {
            this.client.once("ready", () => {
                this.client.on("messageCreate", message => this.handle(message));
                if (this.handling.handleEdits) {
                    this.client.on("messageUpdate", async (o, m) => {
                        if (o.content === (m === null || m === void 0 ? void 0 : m.content))
                            return;
                        if (this.handling.handleEdits)
                            await this.handle(o);
                    });
                }
            });
        }
    }
    /**
     * A wrapper for the super.add method
     * @param component
     * @since 1.0.0
     */
    add(component) {
        const command = super.add(component);
        if (!command)
            return null;
        for (let alias of command.aliases) {
            const conflict = this.aliases.get(alias.toLowerCase());
            if (conflict)
                throw new errors_1.IllegalStateError(`Alias '${alias}' of '${command.name}' already exists on '${conflict}'`);
            alias = alias.toLowerCase();
            this.aliases.set(alias, command.name);
            if (this.handling.aliasReplacement) {
                const replacement = alias.replace(this.handling.aliasReplacement, "");
                if (replacement !== alias) {
                    const replacementConflict = this.aliases.get(replacement);
                    if (replacementConflict)
                        throw new errors_1.IllegalStateError(`Alias '${alias}' of '${command.name}' already exists on '${conflict}'`);
                    this.aliases.set(replacement, command.name);
                }
            }
        }
        if (command.prefix != null) {
            let newEntry = false;
            if (Array.isArray(command.prefix)) {
                for (const prefix of command.prefix) {
                    const prefixes = this.prefixes.get(prefix);
                    if (prefixes) {
                        prefixes.add(command.name);
                    }
                    else {
                        this.prefixes.set(prefix, new Set([command.name]));
                        newEntry = true;
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes) {
                    prefixes.add(command.name);
                }
                else {
                    this.prefixes.set(command.prefix, new Set([command.name]));
                    newEntry = true;
                }
            }
            if (newEntry) {
                this.prefixes = this.prefixes.sort((aVal, bVal, aKey, bKey) => __1.Util.prefixCompare(aKey, bKey));
            }
        }
        return command;
    }
    /**
     * A wrapper for the super.remove method.
     * @param resolvable
     * @since 1.0.0
     */
    remove(resolvable) {
        const command = super.remove(resolvable);
        if (!command)
            return null;
        for (let alias of command.aliases) {
            alias = alias.toLowerCase();
            this.aliases.delete(alias);
            if (this.handling.aliasReplacement) {
                const replacement = alias.replace(this.handling.aliasReplacement, "");
                if (replacement !== alias)
                    this.aliases.delete(replacement);
            }
        }
        if (command.prefix != null) {
            if (Array.isArray(command.prefix)) {
                for (const prefix of command.prefix) {
                    const prefixes = this.prefixes.get(prefix);
                    if (prefixes.size === 1) {
                        this.prefixes.delete(prefix);
                    }
                    else {
                        prefixes.delete(prefix);
                    }
                }
            }
            else {
                const prefixes = this.prefixes.get(command.prefix);
                if (prefixes.size === 1) {
                    this.prefixes.delete(command.prefix);
                }
                else {
                    prefixes.delete(command.prefix);
                }
            }
        }
        return command;
    }
    useInhibitorStore(inhibitorStore) {
        this.inhibitors = inhibitorStore;
        this.types.inhibitors = inhibitorStore;
        return this;
    }
    useMonitorStore(inhibitorStore) {
        this.types.monitors = inhibitorStore;
        return this;
    }
    useListenersStore(listenerStore) {
        this.types.listeners = listenerStore;
        return this;
    }
    /**
     * Finds a command
     * @param id
     */
    findCommand(id) {
        return this.components.get(this.aliases.get(id.toLowerCase()));
    }
    // Command Handling
    /**
     * Handles a sent message.
     * @param message The received message.
     * @since 1.0.0
     */
    async handle(message) {
        try {
            if (await this.runAllTypeInhibitors(message))
                return false;
            if (this.contextStorage.has(message.id)) {
                message.ctx = this.contextStorage.get(message.id);
            }
            else {
                message.ctx = new __1.Context(this, message);
                this.contextStorage.set(message.id, message.ctx);
            }
            if (await this.runPreTypeInhibitors(message))
                return false;
            let parsed = await this.parseCommand(message);
            if (!parsed.command) {
                const overParsed = await this.parseCommandOverwrittenPrefixes(message);
                if (overParsed.command || (parsed.prefix == null && overParsed.prefix != null)) {
                    parsed = overParsed;
                }
            }
            let ran;
            if (!parsed.command) {
                ran = await this.handleRegexAndConditionalCommands(message);
            }
            else {
                ran = await this.handleDirectCommand(message, parsed.content, parsed.command);
            }
            if (ran === false) {
                this.emit(CommandStoreEvents.MESSAGE_INVALID, message.ctx);
                return false;
            }
            return ran;
        }
        catch (e) {
            this.emit("error", e, message);
            return false;
        }
    }
    async handleRegexAndConditionalCommands(message) {
        const ran1 = await this.handleRegexCommands(message);
        const ran2 = await this.handleConditionalCommands(message);
        return ran1 || ran2;
    }
    async handleRegexCommands(message) {
        const hasRegexCommands = [];
        for (const command of this.components.values()) {
            if (message.editedTimestamp ? command.editable : true) {
                const regex = typeof command.regex === "function"
                    ? await command.regex(message.ctx)
                    : command.regex;
                if (regex)
                    hasRegexCommands.push({ command, regex });
            }
        }
        const matchedCommands = [];
        for (const entry of hasRegexCommands) {
            console.log(entry);
            const match = message.content.match(entry.regex);
            if (!match)
                continue;
            const matches = [];
            if (entry.regex.global) {
                let matched;
                while ((matched = entry.regex.exec(message.content)) != null) {
                    matches.push(matched);
                }
            }
            matchedCommands.push({ command: entry.command, match, matches });
        }
        if (!matchedCommands.length) {
            return false;
        }
        const promises = [];
        for (const { command, match, matches } of matchedCommands) {
            promises.push((async () => {
                try {
                    if (await this.runPostTypeInhibitors(message, command))
                        return;
                    const before = command.before(message.ctx);
                    if (__1.Util.isPromise(before))
                        await before;
                    await this.runCommand(message, command, { match, matches });
                }
                catch (err) {
                    this.emit("error", err, message, command);
                }
            })());
        }
        await Promise.all(promises);
        return true;
    }
    async handleConditionalCommands(message) {
        const trueCommands = this.components.filter((command) => (message.editedTimestamp ? command.editable : true) &&
            command.condition(message.ctx));
        if (!trueCommands.size) {
            return false;
        }
        const promises = [];
        for (const command of trueCommands.values()) {
            promises.push((async () => {
                try {
                    if (await this.runPostTypeInhibitors(message, command))
                        return;
                    const before = command.before(message.ctx);
                    if (__1.Util.isPromise(before))
                        await before;
                    await this.runCommand(message, command, {});
                }
                catch (err) {
                    this.emit("error", err, message, command);
                }
            })());
        }
        await Promise.all(promises);
        return true;
    }
    async handleDirectCommand(message, content, command, ignore = false) {
        let key;
        try {
            if (!ignore) {
                if (message.editedTimestamp && !command.editable) {
                    return false;
                }
                if (await this.runPostTypeInhibitors(message, command)) {
                    return false;
                }
            }
            const before = command.before(message.ctx);
            if (__1.Util.isPromise(before))
                await before;
            const args = await command.parse(message, content);
            if (command_1.Flag.is(args, "cancel")) {
                this.emit(CommandStoreEvents.COMMAND_CANCELLED, message.ctx, command);
                return true;
            }
            else if (command_1.Flag.is(args, "retry")) {
                this.emit(CommandStoreEvents.COMMAND_BREAKOUT, message.ctx, command, args.message);
                return this.handle(args.message);
            }
            else if (command_1.Flag.is(args, "continue")) {
                const continueCommand = this.components.get(args.command);
                return this.handleDirectCommand(message, args.rest, continueCommand, args.ignore);
            }
            if (!ignore) {
                if (command.lock)
                    key = command.lock(message.ctx, args);
                if (__1.Util.isPromise(key))
                    key = await key;
                if (key) {
                    if (command.locker.has(key)) {
                        key = null;
                        this.emit(CommandStoreEvents.COMMAND_LOCKED, message.ctx, command);
                        return true;
                    }
                    command.locker.add(key);
                }
            }
            return await this.runCommand(message, command, args);
        }
        catch (err) {
            this.emit("error", err, message, command);
            return null;
        }
        finally {
            if (key)
                command.locker.delete(key);
        }
    }
    async runCommand(message, command, args) {
        if (this.handling.sendTyping)
            await message.channel.sendTyping();
        try {
            this.emit(CommandStoreEvents.COMMAND_STARTED, message, command);
            const ret = await command.run(message.ctx, args);
            this.emit(CommandStoreEvents.COMMAND_FINISHED, message, command, ret);
        }
        catch (e) {
            this.emit("commandError", message, command, e);
        }
        finally {
            const ignored = __1.Util.array(__1.Util.isFunction(this.handling.ignoreCooldown)
                ? await this.handling.ignoreCooldown.call(this, message, command)
                : this.handling.ignoreCooldown);
            if (command.cooldown > 0 && !ignored.includes(message.author.id)) {
                const cooldown = this.getCooldown(message, command);
                try {
                    cooldown.drip();
                }
                catch (err) {
                    this.client.emit("cooldown", message, command, cooldown.remainingTime);
                }
            }
        }
    }
    async parseCommand(message) {
        let prefixes = __1.Util.array(await __1.Util.intoCallable(this.handling.prefix)(message.ctx));
        const allowMention = await __1.Util.intoCallable(this.handling.prefix)(message.ctx);
        if (allowMention) {
            const mentions = [
                `<@${this.client.user.id}>`,
                `<@!${this.client.user.id}>`,
            ];
            prefixes = [...mentions, ...prefixes];
        }
        prefixes.sort(__1.Util.prefixCompare);
        return this.parseMultiplePrefixes(message, prefixes.map((p) => [p, null]));
    }
    // Parsing
    parseMultiplePrefixes(message, pairs) {
        const parses = pairs.map(([prefix, cmds]) => this.parseWithPrefix(message, prefix, cmds));
        const result = parses.find((parsed) => parsed.command);
        if (result)
            return result;
        const guess = parses.find((parsed) => parsed.prefix != null);
        if (guess)
            return guess;
        return {};
    }
    parseWithPrefix(message, prefix, associatedCommands = null) {
        const lowerContent = message.content.toLowerCase();
        if (!lowerContent.startsWith(prefix.toLowerCase())) {
            return {};
        }
        const endOfPrefix = lowerContent.indexOf(prefix.toLowerCase()) + prefix.length;
        const startOfArgs = message.content.slice(endOfPrefix).search(/\S/) + prefix.length;
        const alias = message.content.slice(startOfArgs).split(/\s+|\n+/)[0];
        const command = this.findCommand(alias);
        const content = message.content
            .slice(startOfArgs + alias.length + 1)
            .trim();
        const afterPrefix = message.content.slice(prefix.length).trim();
        if (!command)
            return { prefix, alias, content, afterPrefix };
        if (associatedCommands == null) {
            if (command.prefix != null) {
                return { prefix, alias, content, afterPrefix };
            }
        }
        else if (!associatedCommands.has(command.name)) {
            return { prefix, alias, content, afterPrefix };
        }
        return { command, prefix, alias, content, afterPrefix };
    }
    async parseCommandOverwrittenPrefixes(message) {
        if (!this.prefixes.size) {
            return {};
        }
        const promises = this.prefixes.map(async (cmds, provider) => {
            const prefixes = __1.Util.array(await __1.Util.intoCallable(provider)(message.ctx));
            return prefixes.map((p) => [p, cmds]);
        });
        const pairs = __1.Util.flatMap(await Promise.all(promises), (x) => x);
        pairs.sort(([a], [b]) => __1.Util.prefixCompare(a, b));
        return this.parseMultiplePrefixes(message, pairs);
    }
    /**
     * Runs all "all" type inhibitors.
     * @param message The message to pass.
     * @since 1.0.0
     */
    async runAllTypeInhibitors(message) {
        const reason = this.inhibitors
            ? await this.inhibitors.test("all", message)
            : null;
        if (reason != null)
            this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, reason);
        else if (this.handling.allowSelf && message.author.id === this.client.user.id) {
            console.log("self");
            this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, PreDefinedReason.SELF);
        }
        else if (!this.handling.allowBots && message.author.bot) {
            this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, PreDefinedReason.BOT);
        }
        else if (this.hasPrompt(message.channel, message.author))
            this.emit(CommandStoreEvents.IN_PROMPT, message);
        else
            return false;
        return true;
    }
    // Inhibitors
    /**
     * Runs all "pre" type inhibitors
     * @param message The message to pass.
     * @since 1.0.0
     */
    async runPreTypeInhibitors(message) {
        const reason = this.inhibitors
            ? await this.inhibitors.test('pre', message)
            : null;
        if (reason != null)
            this.emit(CommandStoreEvents.MESSAGE_INHIBITED, message, reason);
        else
            return false;
        return true;
    }
    /**
     * Runs all "post" type inhibitors.
     * @param message The message to pass.
     * @param command The command to pass.
     * @since 1.0.0
     */
    async runPostTypeInhibitors(message, command) {
        if (command.restrictions.includes("owner")) {
            const isOwner = this.client.isOwner(message.author);
            if (!isOwner) {
                this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, PreDefinedReason.DEVELOPER);
                return true;
            }
        }
        if (command.channel.includes("text") && !message.member) {
            this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, PreDefinedReason.GUILD);
            return true;
        }
        if (!command.channel.includes("dm") && message.channel.type === eris_1.Constants.ChannelTypes.DM) {
            this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, PreDefinedReason.DM);
            return true;
        }
        if (await this.runPermissionChecks(message, command))
            return true;
        const reason = this.inhibitors
            ? await this.inhibitors.test("post", message, command)
            : null;
        if (reason != null) {
            this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, reason);
            return true;
        }
        return false;
    }
    async runAllCommandInhibitors(message, command) {
        const reason = this.inhibitors
            ? await this.inhibitors.test("command", message, command)
            : null;
        if (reason != null)
            this.emit(CommandStoreEvents.COMMAND_INHIBITED, message, command, reason);
        else
            return false;
        return true;
    }
    /**
     * Runs permissions checks.
     * @param message The message to pass.
     * @param command THe command to pass.
     */
    async runPermissionChecks(message, command) {
        if (command.permissions) {
            if (__1.Util.isFunction(command.permissions)) {
                let missing = command.permissions(message);
                if (__1.Util.isPromise(missing))
                    missing = await missing;
                if (missing != null) {
                    this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, 'client', missing);
                    return true;
                }
            }
            else if (message.member) {
                const me = message.member.guild.members.get(this.client.user.id);
                if (!Permissions_1.default.overlaps(me.permission.allow, command.permissionsBytecode)) {
                    const _ = command.permissionsBytecode & ~me.permission.allow;
                    this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, 'client', _);
                    return true;
                }
            }
        }
        if (command.userPermissions) {
            const ignorer = this.handling.ignorePermissions;
            const isIgnored = Array.isArray(ignorer)
                ? ignorer.includes(message.author.id)
                : typeof ignorer === 'function'
                    ? ignorer(message, command)
                    : message.author.id === ignorer;
            if (!isIgnored) {
                if (__1.Util.isFunction(command.userPermissions)) {
                    let missing = command.userPermissions(message);
                    if (__1.Util.isPromise(missing))
                        missing = await missing;
                    if (missing != null) {
                        this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, 'user', missing);
                        return true;
                    }
                }
                else if (message.member) {
                    if (!Permissions_1.default.overlaps(message.member.permission.allow, command.userPermissionsBytecode)) {
                        const _ = command.userPermissionsBytecode & ~message.member.permission.allow;
                        this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, 'user', _);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Add a prompt to the prompt storage.
     * @param channel The channel of the prompt.
     * @param user The user to add.
     */
    addPrompt(channel, user) {
        let users = this.promptStorage.get(channel.id);
        if (!users)
            this.promptStorage.set(channel.id, new Set());
        users = this.promptStorage.get(channel.id);
        users.add(user.id);
    }
    /**
     * Removes a prompt
     * @param channel Prompt channel.
     * @param user Prompt user.
     */
    removePrompt(channel, user) {
        const users = this.promptStorage.get(channel.id);
        if (!users)
            return;
        users.delete(user.id);
        if (!users.size)
            this.promptStorage.delete(user.id);
    }
    /**
     * Check if a prompt exists.
     * @param channel The channel of the prompt.
     * @param user A user of the prompt.
     */
    hasPrompt(channel, user) {
        const users = this.promptStorage.get(channel.id);
        if (!users)
            return false;
        return users.has(user.id);
    }
    getCooldown(message, command) {
        let cooldownManager = this.cooldowns.get(command);
        if (!cooldownManager) {
            cooldownManager = new command_1.RatelimitManager(command.bucket, command.cooldown);
            this.cooldowns.set(command, cooldownManager);
        }
        return cooldownManager.acquire(message.ctx.guild ? Reflect.get(message, command.cooldownType).id : message.author.id);
    }
}
exports.CommandStore = CommandStore;
var CommandStoreEvents;
(function (CommandStoreEvents) {
    CommandStoreEvents["MESSAGE_INHIBITED"] = "messageInhibited";
    CommandStoreEvents["MESSAGE_INVALID"] = "messageInvalid";
    CommandStoreEvents["IN_PROMPT"] = "messageInPrompt";
    CommandStoreEvents["MISSING_PERMISSIONS"] = "missingPermissions";
    CommandStoreEvents["COMMAND_INHIBITED"] = "commandInhibited";
    CommandStoreEvents["COMMAND_BREAKOUT"] = "commandBreakout";
    CommandStoreEvents["COMMAND_LOCKED"] = "commandLocked";
    CommandStoreEvents["COMMAND_CANCELLED"] = "commandCancelled";
    CommandStoreEvents["COMMAND_STARTED"] = "commandStarted";
    CommandStoreEvents["COMMAND_FINISHED"] = "commandFinished";
})(CommandStoreEvents = exports.CommandStoreEvents || (exports.CommandStoreEvents = {}));
var PreDefinedReason;
(function (PreDefinedReason) {
    PreDefinedReason["SELF"] = "blockedSelf";
    PreDefinedReason["BOT"] = "blockedBot";
    PreDefinedReason["GUILD"] = "guild";
    PreDefinedReason["DM"] = "dm";
    PreDefinedReason["DEVELOPER"] = "developer";
})(PreDefinedReason = exports.PreDefinedReason || (exports.PreDefinedReason = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaUNBQW9GO0FBQ3BGLDZCQVVlO0FBQ2YsMEVBQWtEO0FBSWxELCtCQUFpQztBQUNqQyxvREFBaUc7QUFDakcsOENBQXNEO0FBc0V0RDs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLHFCQUF1QjtJQThDdkQ7Ozs7T0FJRztJQUNILFlBQW1CLE1BQW1CLEVBQUUsVUFBK0IsRUFBRTs7UUFDdkUsS0FBSyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7WUFDeEIsR0FBRyxPQUFPO1lBQ1YsYUFBYSxFQUFFLGlCQUFPO1NBQ3ZCLENBQUMsQ0FBQztRQXJDTDs7O1dBR0c7UUFDSSxZQUFPLEdBQTRCLElBQUksV0FBTyxFQUFFLENBQUM7UUFDeEQ7O1dBRUc7UUFDSSxhQUFRLEdBQWtELElBQUksV0FBTyxFQUFFLENBQUM7UUFFL0U7OztXQUdHO1FBQ2MsY0FBUyxHQUF1QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQy9FOzs7O1dBSUc7UUFDYyxrQkFBYSxHQUFpQyxJQUFJLFdBQU8sRUFBRSxDQUFDO1FBQzdFOzs7O1dBSUc7UUFDYyxtQkFBYyxHQUE2QixJQUFJLFdBQU8sRUFBRSxDQUFDO1FBYXhFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxnQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBSSxDQUFDLFVBQVUsQ0FBa0I7WUFDL0MsU0FBUyxFQUFFLEtBQUs7WUFDaEIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLElBQUk7WUFDYixjQUFjLEVBQUUsRUFBRTtZQUNsQixpQkFBaUIsRUFBRSxFQUFFO1lBQ3JCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFdBQVcsRUFBRSxJQUFJ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