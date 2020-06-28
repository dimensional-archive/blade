"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@ayanaware/errors");
const eris_1 = require("@kyu/eris");
const __1 = require("../..");
const Permissions_1 = require("../../utils/Permissions");
const Components_1 = require("../Components");
const command_1 = require("../components/command/");
const Base_1 = require("./Base");
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
            classToHandle: command_1.Command,
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
                message.ctx = new (Components_1.Components.get("context"))(this, message);
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
            // @ts-ignore
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
                if (!Permissions_1.Permissions.overlaps(me.permission.allow, command.permissionsBytecode)) {
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
                    if (!Permissions_1.Permissions.overlaps(message.member.permission.allow, command.userPermissionsBytecode)) {
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
            cooldownManager = new command_1.RatelimitManager(command.bucket, command.cooldown);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RvcmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBc0Q7QUFDdEQsb0NBQXNDO0FBRXRDLDZCQUFpSTtBQUNqSSx5REFBc0Q7QUFFdEQsOENBQTJDO0FBQzNDLG9EQUFpRztBQUNqRyxpQ0FBb0Y7QUF5RXBGOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEscUJBQXVCO0lBb0R2RDs7OztPQUlHO0lBQ0gsWUFBbUIsTUFBbUIsRUFBRSxVQUErQixFQUFFOztRQUN2RSxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtZQUN4QixHQUFHLE9BQU87WUFDVixhQUFhLEVBQUUsaUJBQU87U0FDdkIsQ0FBQyxDQUFDO1FBM0NMOzs7V0FHRztRQUNJLFlBQU8sR0FBNEIsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQUN4RDs7V0FFRztRQUNJLGFBQVEsR0FHWCxJQUFJLFdBQU8sRUFBRSxDQUFDO1FBRWxCOzs7V0FHRztRQUNjLGNBQVMsR0FHdEIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNsQjs7OztXQUlHO1FBQ2Msa0JBQWEsR0FBaUMsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQUM3RTs7OztXQUlHO1FBQ2MsbUJBQWMsR0FBNkIsSUFBSSxXQUFPLEVBQUUsQ0FBQztRQWF4RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZ0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQUksQ0FBQyxVQUFVLENBQ1o7WUFDZixTQUFTLEVBQUUsS0FBSztZQUNoQixTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixPQUFPLEVBQUUsSUFBSTtZQUNiLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsYUFBYSxFQUFFLElBQUk7WUFDbkIsV0FBVyxF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