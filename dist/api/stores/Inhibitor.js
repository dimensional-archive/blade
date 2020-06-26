"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Inhibitor_1 = require("../components/Inhibitor");
const __1 = require("../..");
class InhibitorStore extends Base_1.ComponentStore {
    constructor(client, options = {}) {
        super(client, "inhibitors", {
            classToHandle: Inhibitor_1.Inhibitor,
            ...options
        });
    }
    /**
     * Tests inhibitors against the message.
     * @param type The type of inhibitors to test.
     * @param message Message to test.
     * @param command Command to use.
     */
    async test(type, message, command) {
        if (!this.components.size)
            return null;
        const inhibitors = this.components.filter(i => i.type === type && (i.type === "command" ? command.inhibitors.includes(i.name) : false));
        if (!inhibitors.size)
            return null;
        const promises = [];
        for (const inhibitor of inhibitors.values()) {
            promises.push((async () => {
                let inhibited = inhibitor.run(message, command);
                if (__1.Util.isPromise(inhibited))
                    inhibited = await inhibited;
                if (inhibited)
                    return inhibitor;
                return null;
            })());
        }
        const inhibitedInhibitors = (await Promise.all(promises)).filter(r => r);
        if (!inhibitedInhibitors.length)
            return null;
        inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
        return inhibitedInhibitors[0].reason;
    }
}
exports.InhibitorStore = InhibitorStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9zdG9yZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQStEO0FBQy9ELHVEQUFtRTtBQUluRSw2QkFBc0M7QUFFdEMsTUFBYSxjQUFlLFNBQVEscUJBQXlCO0lBQzNELFlBQVksTUFBbUIsRUFBRSxVQUFpQyxFQUFFO1FBQ2xFLEtBQUssQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO1lBQzFCLGFBQWEsRUFBRSxxQkFBUztZQUN4QixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQW1CLEVBQUUsT0FBZ0IsRUFBRSxPQUFpQjtRQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEMsTUFBTSxRQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUVwQyxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLFFBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO29CQUFFLFNBQVMsR0FBRyxNQUFNLFNBQVMsQ0FBQztnQkFDM0QsSUFBSSxTQUFTO29CQUFFLE9BQU8sU0FBUyxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNQO1FBRUQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFN0MsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsT0FBTyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQztDQUNGO0FBckNELHdDQXFDQyJ9