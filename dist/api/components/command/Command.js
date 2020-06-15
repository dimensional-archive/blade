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
    run(ctx, args) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtDQUFzRDtBQUN0RCxnQ0FBMkc7QUFFM0csOENBQThEO0FBSTlELDhEQUE4RTtBQUM5RSw0REFBeUQ7QUFzSHpEOzs7R0FHRztBQUNILE1BQWEsT0FBUSxTQUFRLGdCQUFTO0lBc0dwQzs7Ozs7O09BTUc7SUFDSCxZQUFtQixLQUFtQixFQUFFLEdBQVcsRUFBRSxJQUFjLEVBQUUsVUFBMEIsRUFBRTs7UUFDL0YsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBeEduQixXQUFNLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUE0RnJELGlDQUE4QjtRQUM5QixxQ0FBc0M7UUFDdEMsMEJBQWtDLElBQUksK0JBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQztRQVl6RCxPQUFPLEdBQUcsUUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqRCxNQUFNLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNoRSxDQUFDLENBQUMsNkJBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUN0QyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXZFLHVCQUFBLElBQUksa0JBQWtCLElBQUksNkJBQWEsQ0FBQztZQUN0QyxTQUFTO1lBQ1QsZUFBZTtZQUNmLE1BQU0sUUFBRSxPQUFPLENBQUMsTUFBTSxtQ0FBSSxJ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