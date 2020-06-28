"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
__export(require("./Client"));
__export(require("./Structures"));
__export(require("./command"));
__export(require("./structures"));
__export(require("./util"));
Object.defineProperty(eris_1.Message.prototype, "guild", {
    get() {
        return (this.channel instanceof eris_1.TextChannel
            ? this.channel.guild
            : undefined);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBZ0U7QUFHaEUsOEJBQXlCO0FBQ3pCLGtDQUE2QjtBQUU3QiwrQkFBMEI7QUFDMUIsa0NBQTZCO0FBQzdCLDRCQUF1QjtBQVN2QixNQUFNLENBQUMsY0FBYyxDQUFDLGNBQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO0lBQ2hELEdBQUc7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxrQkFBVztZQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLENBQUMsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUNsQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIn0=