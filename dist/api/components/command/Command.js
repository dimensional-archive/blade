"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _contentParser, _argumentGenerator, _argumentRunner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const Base_1 = require("../Base");
const __1 = require("../../..");
const errors_1 = require("@ayanaware/errors");
const ArgumentRunner_1 = require("./argument/ArgumentRunner");
const ContentParser_1 = require("./argument/ContentParser");
/**
 * The base command class.
 * @since 1.0.0
 */
class Command extends Base_1.Component {
    /**
     * Creates a new Command.
     * @param store The command store.
     * @param dir The directory that holds this command/
     * @param file The path to this command.
     * @param options Options to use.
     */
    constructor(store, dir, file, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        super(store, dir, file, options);
        this.locker = new Set();
        _contentParser.set(this, void 0);
        _argumentGenerator.set(this, void 0);
        _argumentRunner.set(this, new ArgumentRunner_1.ArgumentRunner(this));
        options = __1.Util.deepAssign({ args: [] }, options);
        const { flagWords, optionFlagWords } = Array.isArray(options.args)
            ? ContentParser_1.ContentParser.getFlags(options.args)
            : { flagWords: options.flags, optionFlagWords: options.optionFlags };
        __classPrivateFieldSet(this, _contentParser, new ContentParser_1.ContentParser({
            flagWords,
            optionFlagWords,
            quoted: (_a = options.quoted) !== null && _a !== void 0 ? _a : true,
            separator: options.separator
        }));
        __classPrivateFieldSet(this, _argumentGenerator, Array.isArray(options.args)
            ? ArgumentRunner_1.ArgumentRunner.fromArguments(options.args.map((arg) => [arg.id, new __1.Argument(this, arg)]))
            : options.args.bind(this));
        this.argumentDefaults = (_b = options.argumentDefaults) !== null && _b !== void 0 ? _b : {};
        this.aliases = [...((_c = options.aliases) !== null && _c !== void 0 ? _c : []), this.name];
        this.description = (_d = options.description) !== null && _d !== void 0 ? _d : {};
        this.editable = (_e = options.editable) !== null && _e !== void 0 ? _e : true;
        this.bucket = (_f = options.bucket) !== null && _f !== void 0 ? _f : 1;
        this.cooldown = (_g = options.cooldown) !== null && _g !== void 0 ? _g : 5000;
        this.cooldownType = (_h = options.cooldownType) !== null && _h !== void 0 ? _h : "author";
        this.hidden = (_j = options.hidden) !== null && _j !== void 0 ? _j : false;
        this.guarded = (_k = options.guarded) !== null && _k !== void 0 ? _k : false;
        this.restrictions = options.restrictions
            ? __1.Util.array(options.restrictions)
            : [];
        this.channel = options.channel
            ? __1.Util.array(options.channel)
            : ["dm", "text"];
        this.userPermissions = options.userPermissions
            ? __1.Util.array(options.userPermissions)
            : [];
        this.permissions = options.permissions
            ? __1.Util.array(options.permissions)
            : [];
        this.inhibitors = options.inhibitors
            ? __1.Util.array(options.inhibitors)
            : [];
        this.before = options.before
            ? options.before.bind(this)
            : () => true;
        this.prefix = options.prefixes
            ? typeof options.prefixes === "function"
                ? options.prefixes.bind(this)
                : __1.Util.array(options.prefixes)
            : null;
        this.regex = options.regex
            ? typeof options.regex === "function"
                ? options.regex.bind(this)
                : options.regex
            : null;
        this.condition = options.condition
            ? options.condition.bind(this)
            : () => false;
        this.lock = options.lock;
        if (typeof options.lock === "string") {
            this.lock = {
                guild: (ctx) => ctx.guild && ctx.guild.id,
                channel: (ctx) => ctx.channel.id,
                user: (ctx) => ctx.author.id,
            }[options.lock];
        }
    }
    /**
     * Returns the bytecode of the required user permissions.
     * @since 1.0.0
     */
    get userPermissionsBytecode() {
        return this.userPermissions.reduce((acc, perm) => acc |= perm.allow, 0);
    }
    /**
     * Returns the bytecode of the required client permissions.
     * @since 1.0.0
     */
    get permissionsBytecode() {
        return this.permissions.reduce((acc, perm) => acc |= perm.allow, 0);
    }
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this command.
     * @constructor
     */
    static Setup(options = {}) {
        return Base_1.Component.Setup(options);
    }
    /**
     * Executes this command.
     * @param ctx The message context for this execution.
     * @param args The parsed arguments.
     */
    async run(ctx, args) {
        throw new errors_1.MethodNotImplementedError();
    }
    /**
     * Parses the arguments of this command.
     * @param message
     * @param content
     */
    parse(message, content) {
        const parsed = __classPrivateFieldGet(this, _contentParser).parse(content);
        return __classPrivateFieldGet(this, _argumentRunner).run(message, parsed, __classPrivateFieldGet(this, _argumentGenerator));
    }
}
exports.Command = Command;
_contentParser = new WeakMap(), _argumentGenerator = new WeakMap(), _argumentRunner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQ0FBc0Q7QUFDdEQsZ0NBQTJHO0FBRTNHLDhDQUE4RDtBQUk5RCw4REFBOEU7QUFDOUUsNERBQXlEO0FBc0h6RDs7O0dBR0c7QUFDSCxNQUFhLE9BQVEsU0FBUSxnQkFBUztJQXNHcEM7Ozs7OztPQU1HO0lBQ0gsWUFBbUIsS0FBbUIsRUFBRSxHQUFXLEVBQUUsSUFBYyxFQUFFLFVBQTBCLEVBQUU7O1FBQy9GLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQXhHbkIsV0FBTSxHQUFxQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBNEZyRCxpQ0FBOEI7UUFDOUIscUNBQXNDO1FBQ3RDLDBCQUFrQyxJQUFJLCtCQUFjLENBQUMsSUFBSSxDQUFDLEVBQUM7UUFZekQsT0FBTyxHQUFHLFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakQsTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDaEUsQ0FBQyxDQUFDLDZCQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdEMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV2RSx1QkFBQSxJQUFJLGtCQUFrQixJQUFJLDZCQUFhLENBQUM7WUFDdEMsU0FBUztZQUNULGVBQWU7WUFDZixNQUFNLFFBQUUsT0FBTyxDQUFDLE1BQU0sbUNBQUks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