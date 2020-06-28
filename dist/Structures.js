"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class Structures {
    /**
     * Extend a part used by blade.
     * @since 1.0.6
     */
    static extend(structure, extender) {
        this._structures[structure] =
            typeof extender === "function"
                ? extender(this._structures[structure])
                : extender;
        return this;
    }
    /**
     * Get a part.
     * @param part The part to get.
     * @since 1.0.6
     */
    static get(structure) {
        return this._structures[structure];
    }
}
exports.Structures = Structures;
Structures._structures = {
    context: command_1.Context,
    replyBuilder: command_1.ReplyBuilder,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RydWN0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TdHJ1Y3R1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtEO0FBT2xELE1BQXNCLFVBQVU7SUFNOUI7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FDbEIsU0FBWSxFQUNaLFFBQXlDO1FBRXpDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO1lBQ3pCLE9BQU8sUUFBUSxLQUFLLFVBQVU7Z0JBQzVCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUVmLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUE4QixTQUFZO1FBQ3pELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxDQUFDOztBQTdCSCxnQ0E4QkM7QUE3QmdCLHNCQUFXLEdBQWdCO0lBQ3hDLE9BQU8sRUFBRSxpQkFBTztJQUNoQixZQUFZLEVBQUUsc0JBQVk7Q0FDM0IsQ0FBQyJ9