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
const errors_1 = require("@ayanaware/errors");
const __1 = require("../../..");
const Base_1 = require("../Base");
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
            separator: options.separator,
        }));
        __classPrivateFieldSet(this, _argumentGenerator, Array.isArray(options.args)
            ? ArgumentRunner_1.ArgumentRunner.fromArguments(options.args.map((arg) => [arg.id, new __1.Argument(this, arg)]))
            : options.args.bind(this));
        this.argumentDefaults = (_b = options.argumentDefaults) !== null && _b !== void 0 ? _b : {};
        this.aliases = [...((_c = options.aliases) !== null && _c !== void 0 ? _c : []), this.name];
        this.editable = (_d = options.editable) !== null && _d !== void 0 ? _d : true;
        this.bucket = (_e = options.bucket) !== null && _e !== void 0 ? _e : 1;
        this.cooldown = (_f = options.cooldown) !== null && _f !== void 0 ? _f : 5000;
        this.cooldownType = (_g = options.cooldownType) !== null && _g !== void 0 ? _g : "author";
        this.hidden = (_h = options.hidden) !== null && _h !== void 0 ? _h : false;
        this.guarded = (_j = options.guarded) !== null && _j !== void 0 ? _j : false;
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
        this.inhibitors = options.inhibitors ? __1.Util.array(options.inhibitors) : [];
        this.before = options.before ? options.before.bind(this) : () => true;
        this.description = options.description
            ? typeof options.description === "function"
                ? options.description.bind(this)
                : options.description
            : { content: "", usage: "" };
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
        return this.userPermissions.reduce((acc, perm) => (acc |= perm.allow), 0);
    }
    /**
     * Returns the bytecode of the required client permissions.
     * @since 1.0.0
     */
    get permissionsBytecode() {
        return this.permissions.reduce((acc, perm) => (acc |= perm.allow), 0);
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
    run() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE4RDtBQUc5RCxnQ0FBMkc7QUFDM0csa0NBQXNEO0FBQ3RELDhEQUE4RTtBQUM5RSw0REFBeUQ7QUFpSXpEOzs7R0FHRztBQUNILE1BQWEsT0FBUSxTQUFRLGdCQUFTO0lBc0dwQzs7Ozs7O09BTUc7SUFDSCxZQUNFLEtBQW1CLEVBQ25CLEdBQVcsRUFDWCxJQUFjLEVBQ2QsVUFBMEIsRUFBRTs7UUFFNUIsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBbEhuQixXQUFNLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFpR3JELGlDQUE4QjtRQUM5QixxQ0FBc0M7UUFDdEMsMEJBQWtDLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQztRQWlCekQsT0FBTyxHQUFHLFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakQsTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDaEUsQ0FBQyxDQUFDLDZCQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdEMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV2RSx1QkFBQSxJQUFJLGtCQUFrQixJQUFJLDZCQUFhLENBQUM7WUFDdEMsU0FBUztZQUNULGVBQWU7WUFDZixNQUFNLFFBQUUsT0FBTyxDQUFDLE1BQU0sbUNBQUks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