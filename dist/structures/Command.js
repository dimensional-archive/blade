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
const Part_1 = require("./base/Part");
const util_1 = require("../util");
const command_1 = require("../command");
/**
 * The base command class.
 * @since 1.0.0
 */
class Command extends Part_1.Part {
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
        _argumentRunner.set(this, new command_1.ArgumentRunner(this));
        options = util_1.Util.deepAssign({ args: [] }, options);
        const { flagWords, optionFlagWords } = Array.isArray(options.args)
            ? command_1.ContentParser.getFlags(options.args)
            : { flagWords: options.flags, optionFlagWords: options.optionFlags };
        __classPrivateFieldSet(this, _contentParser, new command_1.ContentParser({
            flagWords,
            optionFlagWords,
            quoted: (_a = options.quoted) !== null && _a !== void 0 ? _a : true,
            separator: options.separator,
        }));
        __classPrivateFieldSet(this, _argumentGenerator, Array.isArray(options.args)
            ? command_1.ArgumentRunner.fromArguments(options.args.map((arg) => [arg.id, new command_1.Argument(this, arg)]))
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
            ? util_1.Util.array(options.restrictions)
            : [];
        this.channel = options.channel
            ? util_1.Util.array(options.channel)
            : ["dm", "text"];
        this.userPermissions = options.userPermissions
            ? util_1.Util.array(options.userPermissions)
            : [];
        this.permissions = options.permissions
            ? util_1.Util.array(options.permissions)
            : [];
        this.inhibitors = options.inhibitors ? util_1.Util.array(options.inhibitors) : [];
        this.before = options.before ? options.before.bind(this) : () => true;
        this.description = options.description
            ? typeof options.description === "function"
                ? options.description.bind(this)
                : options.description
            : { content: "", usage: "" };
        this.prefix = options.prefixes
            ? typeof options.prefixes === "function"
                ? options.prefixes.bind(this)
                : util_1.Util.array(options.prefixes)
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
        return Part_1.Part.Setup(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFnRDtBQUVoRCxrQ0FBK0I7QUFDL0Isd0NBQTBJO0FBNkgxSTs7O0dBR0c7QUFDSCxNQUFhLE9BQVEsU0FBUSxXQUFJO0lBc0cvQjs7Ozs7O09BTUc7SUFDSCxZQUNFLEtBQW1CLEVBQ25CLEdBQVcsRUFDWCxJQUFjLEVBQ2QsVUFBMEIsRUFBRTs7UUFFNUIsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBbEhuQixXQUFNLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFpR3JELGlDQUE4QjtRQUM5QixxQ0FBc0M7UUFDdEMsMEJBQWtDLElBQUksd0JBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQztRQWlCekQsT0FBTyxHQUFHLFdBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakQsTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDaEUsQ0FBQyxDQUFDLHVCQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdEMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV2RSx1QkFBQSxJQUFJLGtCQUFrQixJQUFJLHVCQUFhLENBQUM7WUFDdEMsU0FBUztZQUNULGVBQWU7WUFDZixNQUFNLFFBQUUsT0FBTyxDQUFDLE1BQU0sbUNBQUksSUFBSTtZQUM5QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7U0FDN0IsQ0FB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