"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerStore = void 0;
const Listener_1 = require("../components/Listener");
const Base_1 = require("./Base");
class ListenerStore extends Base_1.ComponentStore {
    constructor(client, options = {}) {
        var _a;
        super(client, "events", {
            classToHandle: Listener_1.Listener,
            ...options
        });
        this.emitters = (_a = options.emitters) !== null && _a !== void 0 ? _a : {
            client,
            listeners: this
        };
    }
    /**
     * A wrapper for the super.remove method.
     * @param resolvable The listener to remove.
     */
    remove(resolvable) {
        const removed = super.remove(resolvable);
        if (!removed)
            return null;
        removed._unListen();
        return removed;
    }
    /**
     * A wrapper for the super.add method.
     * @param component The listener to add.
     */
    add(component) {
        const listener = super.add(component);
        if (!listener)
            return null;
        listener._listen();
        return listener;
    }
}
exports.ListenerStore = ListenerStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdGVuZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3N0b3Jlcy9MaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBMkQ7QUFDM0QsaUNBQW9GO0FBUXBGLE1BQWEsYUFBYyxTQUFRLHFCQUF3QjtJQUd6RCxZQUFZLE1BQW1CLEVBQUUsVUFBZ0MsRUFBRTs7UUFDakUsS0FBSyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7WUFDdEIsYUFBYSxFQUFFLG1CQUFRO1lBQ3ZCLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLFNBQUcsT0FBTyxDQUFDLFFBQVEsbUNBQUk7WUFDbEMsTUFBTTtZQUNOLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFVBQXlDO1FBQ3JELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQztRQUUxQixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEdBQUcsQ0FBQyxTQUFtQjtRQUM1QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQXRDRCxzQ0FzQ0MifQ==