"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
Object.defineProperty(eris_1.Message.prototype, "guild", {
    get() {
        return this.channel instanceof eris_1.TextChannel
            ? this.channel.guild
            : undefined;
    }
});
__export(require("./api"));
__export(require("./utils"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBZ0U7QUFVaEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtJQUNoRCxHQUFHO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxZQUFZLGtCQUFXO1lBQ3hDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDcEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoQixDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsMkJBQXNCO0FBQ3RCLDZCQUF3QiJ9