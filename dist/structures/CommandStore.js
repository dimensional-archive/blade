"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const command_1 = require("../command");
const Store_1 = require("./base/Store");
const __1 = require("..");
const Structures_1 = require("../Structures");
const Command_1 = require("./Command");
const errors_1 = require("@ayanaware/errors");
/**
 * A command store that handles loading of commands.
 */
class CommandStore extends Store_1.Store {
    /**
     * Creates a new Command Store
     * @param client The client that is using this command store.
     * @param options The options to give.
     */
    constructor(client, options = {}) {
        var _a, _b;
        super(client, "commands", {
            ...options,
            classToHandle: Command_1.Command,
        });
        /**
         * An alias storage.
         * @since 1.0.0
         */
        this.aliases = new __1.Collection();
        /**
         * A prefix storage.
         */
        this.prefixes = new __1.Collection();
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
        this.promptStorage = new __1.Collection();
        /**
         * A storage for contexts.
         * @since 1.0.0
         * @readonly
         */
        this.contextStorage = new __1.Collection();
        this.types = new command_1.TypeResolver(this);
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
            },
        }, (_a = options.handling) !== null && _a !== void 0 ? _a : {});
        this.defaultCooldown = (_b = options.defaultCooldown) !== null && _b !== void 0 ? _b : 5000;
        if (this.handling.enabled) {
            this.client.once("ready", () => {
                this.client.on("messageCreate", (message) => this.handle(message));
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
     * @param part
     * @since 1.0.0
     */
    add(part) {
        const command = super.add(part);
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
        return this.parts.get(this.aliases.get(id.toLowerCase()));
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
                message.ctx = new (Structures_1.Structures.get("context"))(this, message);
                this.contextStorage.set(message.id, message.ctx);
            }
            if (await this.runPreTypeInhibitors(message))
                return false;
            let parsed = await this.parseCommand(message);
            if (!parsed.command) {
                const overParsed = await this.parseCommandOverwrittenPrefixes(message);
                if (overParsed.command ||
                    (parsed.prefix == null && overParsed.prefix != null)) {
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
        for (const command of this.parts.values()) {
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
        const trueCommands = this.parts.filter((command) => (message.editedTimestamp ? command.editable : true) &&
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
                const continueCommand = this.parts.get(args.command);
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
            const ret = await command["run"](message.ctx, args);
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
        else if (this.handling.allowSelf &&
            message.author.id === this.client.user.id) {
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
            ? await this.inhibitors.test("pre", message)
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
        if (!command.channel.includes("dm") &&
            message.channel.type === eris_1.Constants.ChannelTypes.DM) {
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
                    this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, "client", missing);
                    return true;
                }
            }
            else if (message.member) {
                const me = message.member.guild.members.get(this.client.user.id);
                if (!__1.Permissions.overlaps(me.permission.allow, command.permissionsBytecode)) {
                    const _ = command.permissionsBytecode & ~me.permission.allow;
                    this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, "client", _);
                    return true;
                }
            }
        }
        if (command.userPermissions) {
            const ignorer = this.handling.ignorePermissions;
            const isIgnored = Array.isArray(ignorer)
                ? ignorer.includes(message.author.id)
                : typeof ignorer === "function"
                    ? ignorer(message, command)
                    : message.author.id === ignorer;
            if (!isIgnored) {
                if (__1.Util.isFunction(command.userPermissions)) {
                    let missing = command.userPermissions(message);
                    if (__1.Util.isPromise(missing))
                        missing = await missing;
                    if (missing != null) {
                        this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, "user", missing);
                        return true;
                    }
                }
                else if (message.member) {
                    if (!__1.Permissions.overlaps(message.member.permission.allow, command.userPermissionsBytecode)) {
                        const _ = command.userPermissionsBytecode &
                            ~message.member.permission.allow;
                        this.emit(CommandStoreEvents.MISSING_PERMISSIONS, message, command, "user", _);
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
            cooldownManager = new __1.RatelimitManager(command.bucket, command.cooldown);
            this.cooldowns.set(command, cooldownManager);
        }
        return cooldownManager.acquire(message.ctx.guild
            ? Reflect.get(message, command.cooldownType).id
            : message.author.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZFN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZXMvQ29tbWFuZFN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQXlEO0FBQ3pELHdDQUE4RjtBQUM5Rix3Q0FBd0U7QUFFeEUsMEJBQXFFO0FBRXJFLDhDQUEwQztBQUMxQyx1Q0FBb0M7QUFDcEMsOENBQXNEO0FBd0V0RDs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLGFBQWM7SUFvRDlDOzs7O09BSUc7SUFDSCxZQUFtQixNQUFtQixFQUFFLFVBQStCLEVBQUU7O1FBQ3ZFLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQ3hCLEdBQUcsT0FBTztZQUNWLGFBQWEsRUFBRSxpQkFBTztTQUN2QixDQUFDLENBQUM7UUEzQ0w7OztXQUdHO1FBQ0ksWUFBTyxHQUErQixJQUFJLGNBQVUsRUFBRSxDQUFDO1FBQzlEOztXQUVHO1FBQ0ksYUFBUSxHQUdYLElBQUksY0FBVSxFQUFFLENBQUM7UUFFckI7OztXQUdHO1FBQ2MsY0FBUyxHQUd0QixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ2xCOzs7O1dBSUc7UUFDYyxrQkFBYSxHQUFvQyxJQUFJLGNBQVUsRUFBRSxDQUFDO1FBQ25GOzs7O1dBSUc7UUFDYyxtQkFBYyxHQUFnQyxJQUFJLGNBQVUsRUFBRSxDQUFDO1FBYTlFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBSSxDQUFDLFVBQVUsQ0FDWjtZQUNmLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsY0FBYyxFQUFFLEVBQUU7WUFDbEIsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixhQUFhLEVBQUUsSUFBSTtZQUNuQixX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