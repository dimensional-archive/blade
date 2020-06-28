"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
__export(require("./Client"));
__export(require("./Structures"));
__export(require("./command"));
__export(require("./language"));
__export(require("./structures"));
__export(require("./util"));
Object.defineProperty(eris_1.Message.prototype, "guild", {
    get() {
        return (this.channel instanceof eris_1.TextChannel
            ? this.channel.guild
            : undefined);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBZ0U7QUFHaEUsOEJBQXlCO0FBQ3pCLGtDQUE2QjtBQUU3QiwrQkFBMEI7QUFDMUIsZ0NBQTJCO0FBQzNCLGtDQUE2QjtBQUM3Qiw0QkFBdUI7QUFTdkIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtJQUNoRCxHQUFHO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVksa0JBQVc7WUFDekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztZQUNwQixDQUFDLENBQUMsU0FBUyxDQUFFLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUMsQ0FBQSJ9