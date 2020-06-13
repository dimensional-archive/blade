"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InhibitorStore = void 0;
const Base_1 = require("./Base");
const Inhibitor_1 = require("../components/Inhibitor");
const __1 = require("../..");
class InhibitorStore extends Base_1.ComponentStore {
    constructor(client, options = {}) {
        super(client, "events", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oaWJpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9zdG9yZXMvSW5oaWJpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUErRDtBQUMvRCx1REFBbUU7QUFJbkUsNkJBQXNDO0FBRXRDLE1BQWEsY0FBZSxTQUFRLHFCQUF5QjtJQUMzRCxZQUFZLE1BQW1CLEVBQUUsVUFBaUMsRUFBRTtRQUNsRSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUN0QixhQUFhLEVBQUUscUJBQVM7WUFDeEIsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFtQixFQUFFLE9BQWdCLEVBQUUsT0FBaUI7UUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXZDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRWxDLE1BQU0sUUFBUSxHQUFtQixFQUFFLENBQUM7UUFFcEMsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUN4QixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxRQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztvQkFBRSxTQUFTLEdBQUcsTUFBTSxTQUFTLENBQUM7Z0JBQzNELElBQUksU0FBUztvQkFBRSxPQUFPLFNBQVMsQ0FBQztnQkFDaEMsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDUDtRQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTdDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQXJDRCx3Q0FxQ0MifQ==