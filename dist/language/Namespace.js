"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@ayanaware/logger");
const Part_1 = require("../structures/base/Part");
class Namespace {
    constructor(language, file, options = {}) {
        var _a;
        this.client = language.helper.client;
        this.language = language;
        this.name = (_a = options.name) !== null && _a !== void 0 ? _a : file[file.length - 1].slice(0, -3);
        this.directory = language.folder;
        this.file = file;
        this.logger = logger_1.Logger.custom(this.name, "@kyu/blade", () => `locales.${this.language.id}.`);
    }
    /**
     * The namespace data getter.
     */
    get data() {
        return {};
    }
    /**
     * A typescript helper decorator.
     * @param options The options to use when creating this listener.
     * @constructor
     */
    static Setup(options) {
        return Part_1.Part.Setup(options);
    }
}
exports.Namespace = Namespace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmFtZXNwYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xhbmd1YWdlL05hbWVzcGFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUEyQztBQUczQyxrREFBNEQ7QUFFNUQsTUFBYSxTQUFTO0lBaUNwQixZQUFtQixRQUFrQixFQUFFLElBQWMsRUFBRSxVQUFzRCxFQUFFOztRQUM3RyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLFNBQUcsT0FBTyxDQUFDLElBQUksbUNBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDNUYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxJQUFJO1FBQ2IsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBb0I7UUFDdEMsT0FBTyxXQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQTNERCw4QkEyREMifQ==