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
        message.channel.sendTyping();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaUNBQW9GO0FBQ3BGLDZCQUF1SDtBQUN2SCwwRUFBa0Q7QUFJbEQsK0JBQWlDO0FBQ2pDLG9EQUFpRztBQUNqRyw4Q0FBc0Q7QUE4RHREOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEscUJBQXVCO0lBOEN2RDs7OztPQUlHO0lBQ0gsWUFBbUIsTUFBbUIsRUFBRSxVQUErQixFQUFFOztRQUN2RSxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtZQUN4QixHQUFHLE9BQU87WUFDVixhQUFhLEVBQUUsaUJBQU87U0FDdkIsQ0FBQyxDQUFDO1FBckNMOzs7V0FHRztRQUNJLFlBQU8sR0FBNEIsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQUN4RDs7V0FFRztRQUNJLGFBQVEsR0FBa0QsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQUUvRTs7O1dBR0c7UUFDYyxjQUFTLEdBQXVDLElBQUksT0FBTyxFQUFFLENBQUM7UUFDL0U7Ozs7V0FJRztRQUNjLGtCQUFhLEdBQWlDLElBQUksV0FBTyxFQUFFLENBQUM7UUFDN0U7Ozs7V0FJRztRQUNjLG1CQUFjLEdBQTZCLElBQUksV0FBTyxFQUFFLENBQUM7UUFheEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGdCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFJLENBQUMsVUFBVSxDQUFrQjtZQUMvQyxTQUFTLEVBQUUsS0FBSztZQUNoQixTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsSUFBSTtZQUNiLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsYUFBYSxFQUFFLElBQUk7WUFDbkIsV0FBVyxFQUFFLElB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