"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("./base/Store");
const Inhibitor_1 = require("./Inhibitor");
const __1 = require("..");
class InhibitorStore extends Store_1.Store {
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
        if (!this.parts.size)
            return null;
        const inhibitors = this.parts.filter(i => i.type === type && (i.type === "command" ? command.inhibitors.includes(i.name) : false));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9JbmhpYml0b3JTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFtRDtBQUNuRCwyQ0FBdUQ7QUFJdkQsMEJBQW1DO0FBRW5DLE1BQWEsY0FBZSxTQUFRLGFBQWdCO0lBQ2xELFlBQVksTUFBbUIsRUFBRSxVQUF3QixFQUFFO1FBQ3pELEtBQUssQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO1lBQzFCLGFBQWEsRUFBRSxxQkFBUztZQUN4QixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQW1CLEVBQUUsT0FBZ0IsRUFBRSxPQUFpQjtRQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEMsTUFBTSxRQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUVwQyxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLFFBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO29CQUFFLFNBQVMsR0FBRyxNQUFNLFNBQVMsQ0FBQztnQkFDM0QsSUFBSSxTQUFTO29CQUFFLE9BQU8sU0FBUyxDQUFDO2dCQUNoQyxPQUFPLElBQUksQ0FBQztZQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNQO1FBRUQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFN0MsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsT0FBTyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQztDQUNGO0FBckNELHdDQXFDQyJ9