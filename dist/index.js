"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
Object.defineProperty(eris_1.Message.prototype, "guild", {
    get() {
        return this.channel instanceof eris_1.TextChannel
            ? this.channel.guild
            : undefined;
    }
});
__exportStar(require("./api"), exports);
__exportStar(require("./utils"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQWdFO0FBVWhFLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7SUFDaEQsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sWUFBWSxrQkFBVztZQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDaEIsQ0FBQztDQUNGLENBQUMsQ0FBQTtBQUVGLHdDQUFzQjtBQUN0QiwwQ0FBd0IifQ==