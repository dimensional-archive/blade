"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flag = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvY29tcG9uZW50cy9jb21tYW5kL2FyZ3VtZW50L0ZsYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxJQUFJO0lBT2YsWUFBMEIsSUFBWSxFQUFFLE9BQTRCLEVBQUU7UUFBNUMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQU07UUFDbEIsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFnQjtRQUNsQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBVTtRQUMzQixPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQ3BCLE9BQWUsRUFDZixNQUFNLEdBQUcsS0FBSyxFQUNkLElBQUksR0FBRyxJQUFJO1FBRVgsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBVSxFQUFFLElBQVk7UUFDdkMsT0FBTyxLQUFLLFlBQVksSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3RELENBQUM7Q0FDRjtBQWxDRCxvQkFrQ0MifQ==