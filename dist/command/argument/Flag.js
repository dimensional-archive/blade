"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Flag {
    constructor(type, data = {}) {
        this.type = type;
        Object.assign(this, data);
    }
    static cancel() {
        return new Flag("cancel");
    }
    static retry(message) {
        return new Flag("retry", { message });
    }
    static fail(value) {
        return new Flag("fail", { value });
    }
    static continue(command, ignore = false, rest = null) {
        return new Flag("continue", { command, ignore, rest });
    }
    static is(value, type) {
        return value instanceof Flag && value.type === type;
    }
}
exports.Flag = Flag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kL2FyZ3VtZW50L0ZsYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFhLElBQUk7SUFPZixZQUEwQixJQUFZLEVBQUUsT0FBNEIsRUFBRTtRQUE1QyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTTtRQUNsQixPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWdCO1FBQ2xDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFVO1FBQzNCLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FDcEIsT0FBZSxFQUNmLE1BQU0sR0FBRyxLQUFLLEVBQ2QsSUFBSSxHQUFHLElBQUk7UUFFWCxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFVLEVBQUUsSUFBWTtRQUN2QyxPQUFPLEtBQUssWUFBWSxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBbENELG9CQWtDQyJ9