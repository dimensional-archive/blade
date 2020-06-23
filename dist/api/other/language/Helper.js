"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageHelper = void 0;
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
        var _a, _b, _c;
        super();
        this.client = client;
        this.storage = new utils_1.Storage();
        this.createDirectory = (_a = options.createDirectory) !== null && _a !== void 0 ? _a : true;
        this.directory = (_b = options.directory) !== null && _b !== void 0 ? _b : path_1.join(client.directory, "locales");
        this.parse = (_c = options.parse) !== null && _c !== void 0 ? _c : JSON.parse;
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
        const language = this.storage.get(lang);
        if (!language)
            throw new errors_1.IllegalArgumentError(`Language ${lang} does not exist.`);
        return language.translate(path, data);
    }
}
exports.LanguageHelper = LanguageHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaS9vdGhlci9sYW5ndWFnZS9IZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0RDtBQUM1RCx5Q0FBZ0Q7QUFDaEQsMkJBQTBEO0FBQzFELCtCQUEyQztBQUUzQyw4Q0FBcUU7QUFVckUsTUFBYSxjQUFlLFNBQVEsbUJBQVc7SUE0QjdDOzs7T0FHRztJQUNILFlBQW1CLE1BQW1CLEVBQUUsVUFBaUMsRUFBRTs7UUFDekUsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBTyxFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLGVBQWUsU0FBRyxPQUFPLENBQUMsZUFBZSxtQ0FBSSxJQUFJLENBQUM7UUFDdkQsSUFBSSxDQUFDLFNBQVMsU0FBRyxPQUFPLENBQUMsU0FBUyxtQ0FBSSxXQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsS0FBSyxTQUFHLE9BQU8sQ0FBQyxLQUFLLG1DQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFckIsS0FBSyxNQUFNLElBQUksSUFBSSxnQkFBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QyxNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLGNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDbkMsTUFBTSxLQUFLLEdBQUcsZ0JBQVcs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