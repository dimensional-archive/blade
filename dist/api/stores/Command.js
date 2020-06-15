"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBb0Y7QUFDcEYsNkJBQXVIO0FBQ3ZILDBFQUFrRDtBQUlsRCwrQkFBaUM7QUFDakMsb0RBQWlHO0FBQ2pHLDhDQUFzRDtBQThEdEQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxxQkFBdUI7SUE4Q3ZEOzs7O09BSUc7SUFDSCxZQUFtQixNQUFtQixFQUFFLFVBQStCLEVBQUU7O1FBQ3ZFLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLEdBQUcsT0FBTztZQUNWLGFBQWEsRUFBRSxpQkFBTztTQUN2QixDQUFDLENBQUM7UUFyQ0w7OztXQUdHO1FBQ0ksWUFBTyxHQUE0QixJQUFJLFdBQU8sRUFBRSxDQUFDO1FBQ3hEOztXQUVHO1FBQ0ksYUFBUSxHQUFrRCxJQUFJLFdBQU8sRUFBRSxDQUFDO1FBRS9FOzs7V0FHRztRQUNjLGNBQVMsR0FBdUMsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMvRTs7OztXQUlHO1FBQ2Msa0JBQWEsR0FBaUMsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQUM3RTs7OztXQUlHO1FBQ2MsbUJBQWMsR0FBNkIsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQWF4RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQUksQ0FBQyxVQUFVLENBQWtCO1lBQy9DLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsY0FBYyxFQUFFLEVBQUU7WUFDbEIsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixhQUFhLEVBQUUsSUFBSTtZQUNuQixXQUFXLEVBQUUsSUFB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