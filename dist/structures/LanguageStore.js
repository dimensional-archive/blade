"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("./base/Store");
const Language_1 = require("./Language");
const errors_1 = require("@ayanaware/errors");
class LanguageStore extends Store_1.Store {
    /**
     * @param client
     * @param options
     */
    constructor(client, options) {
        var _a;
        super(client, "locales", {
            classToHandle: Language_1.Language,
            ...options,
        });
        this.namespaces = options.namespaces;
        this.fallbackLanguage = (_a = options.fallbackLanguage) !== null && _a !== void 0 ? _a : "en-US";
    }
    /**
     * Get a translation by it's path.
     * @since 1.0.5
     */
    translate(lang, path, data = {}) {
        let language = this.parts.get(lang);
        if (!language) {
            language = this.parts.get(this.fallbackLanguage);
            if (!language)
                throw new errors_1.IllegalArgumentError(`Language ${lang} does not exist.`);
        }
        return language.translate(path, data);
    }
}
exports.LanguageStore = LanguageStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VTdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0xhbmd1YWdlU3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBbUQ7QUFDbkQseUNBQXNDO0FBRXRDLDhDQUF5RDtBQWF6RCxNQUFhLGFBQWMsU0FBUSxhQUFlO0lBWWhEOzs7T0FHRztJQUNILFlBQW1CLE1BQW1CLEVBQUUsT0FBNkI7O1FBQ25FLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO1lBQ3ZCLGFBQWEsRUFBRSxtQkFBUTtZQUN2QixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGdCQUFnQixTQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsbUNBQUksT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFRDs7O09BR0c7SUFDSSxTQUFTLENBQ2QsSUFBWSxFQUNaLElBQVksRUFDWixPQUE0QixFQUFFO1FBRTlCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFFBQVE7Z0JBQ1gsTUFBTSxJQUFJLDZCQUFvQixDQUFDLFlBQVksSUFBSSxrQkFBa0IsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUE1Q0Qsc0NBNENDIn0=