"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("@kyu/eris");
eris_1.Structures.extend("Message", (Message) => class KyuMessage extends Message {
    get guild() {
        return (this.channel instanceof eris_1.TextChannel
            ? this.channel.guild
            : undefined);
    }
});
__export(require("./api"));
__export(require("./utils"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvQ0FBcUU7QUFVckUsaUJBQVUsQ0FBQyxNQUFNLENBQ2YsU0FBUyxFQUNULENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FDVixNQUFNLFVBQStCLFNBQVEsT0FBVTtJQUNyRCxJQUFJLEtBQUs7UUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxrQkFBVztZQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLENBQUMsQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUNsQixDQUFDO0NBQ0YsQ0FDSixDQUFDO0FBRUYsMkJBQXNCO0FBQ3RCLDZCQUF3QiJ9