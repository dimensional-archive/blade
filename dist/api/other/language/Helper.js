"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const Language_1 = require("./Language");
const fs_1 = require("fs");
const path_1 = require("path");
const errors_1 = require("@ayanaware/errors");
class LanguageHelper extends utils_1.LiteEmitter {
    /**
     * @param client
     * @param options
     */
    constructor(client, options = {}) {
        var _a, _b, _c, _d;
        super();
        this.client = client;
        this.storage = new utils_1.Storage();
        this.fallbackLang = (_a = options.fallbackLang) !== null && _a !== void 0 ? _a : "en-US";
        this.createDirectory = (_b = options.createDirectory) !== null && _b !== void 0 ? _b : true;
        this.directory = (_c = options.directory) !== null && _c !== void 0 ? _c : path_1.join(client.directory, "locales");
        this.parse = (_d = options.parse) !== null && _d !== void 0 ? _d : JSON.parse;
    }
    /**
     * Load all languages and their namespaces.
     * @since 1.0.5
     */
    async loadAll() {
        this.storage.clear();
        for (const path of fs_1.readdirSync(this.directory)) {
            const joined = path_1.join(this.directory, path);
            if (fs_1.lstatSync(joined).isDirectory()) {
                const files = fs_1.readdirSync(joined);
                if (files.length > 0) {
                    let metadata = {};
                    if (files.some(p => p.match(/meta.(?:yml|json)/g))) {
                        for await (const file of files) {
                            if (!/meta.(?:yml|json)/g.test(file))
                                continue;
                            metadata = await this.parse(fs_1.readFileSync(path_1.join(joined, file), { encoding: "utf-8" }));
                            break;
                        }
                    }
                    const language = new Language_1.Language(this, joined, metadata), ns = utils_1.Util.walk(joined);
                    ns.map((file) => this.load(language, path_1.relative(joined, file).split(path_1.sep)));
                    this.storage.set(language.id, language);
                }
            }
        }
    }
    /**
     * Loads a namespace.
     * @param language The language that
     * @param file
     * @since 1.0.5
     */
    async load(language, file) {
        const loc = path_1.join(language.folder, ...file);
        try {
            const _ = await Promise.resolve().then(() => __importStar(require(loc))), loaded = 'default' in _ ? _.default : _;
            if (!utils_1.Util.isClass(loaded))
                throw new errors_1.ParseError('The exported structure is not a class.');
            const ns = new loaded(language, file);
            language.addNamespace(ns);
            this.emit("loaded", ns);
        }
        catch (e) {
            this.emit("loadError", new errors_1.ParseError(`Couldn't parse file ${file}`).setCause(e));
        }
        delete require.cache[loc];
        module.children.pop();
    }
    /**
     * Get a translation by it's path.
     * @since 1.0.5
     */
    translate(lang, path, data = {}) {
        let language = this.storage.get(lang);
        if (!language) {
            language = this.storage.get(this.fallbackLang);
            if (!language)
                throw new errors_1.IllegalArgumentError(`Language ${lang} does not exist.`);
        }
        return language.translate(path, data);
    }
}
exports.LanguageHelper = LanguageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaS9vdGhlci9sYW5ndWFnZS9IZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMENBQTREO0FBQzVELHlDQUFnRDtBQUNoRCwyQkFBMEQ7QUFDMUQsK0JBQTJDO0FBRTNDLDhDQUFxRTtBQVdyRSxNQUFhLGNBQWUsU0FBUSxtQkFBVztJQWlDN0M7OztPQUdHO0lBQ0gsWUFBbUIsTUFBbUIsRUFBRSxVQUFpQyxFQUFFOztRQUN6RSxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsWUFBWSxTQUFHLE9BQU8sQ0FBQyxZQUFZLG1DQUFJLE9BQU8sQ0FBQztRQUNwRCxJQUFJLENBQUMsZUFBZSxTQUFHLE9BQU8sQ0FBQyxlQUFlLG1DQUFJLElBQUksQ0FBQztRQUN2RCxJQUFJLENBQUMsU0FBUyxTQUFHLE9BQU8sQ0FBQyxTQUFTLG1DQUFJLFdBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxLQUFLLFNBQUcsT0FBTyxDQUFDLEtBQUssbUNBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLE9BQU87UUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVyQixLQUFLLE1BQU0sSUFBSSxJQUFJLGdCQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzlDLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFDLElBQUksY0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFD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