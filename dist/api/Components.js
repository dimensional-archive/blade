"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = require("./components");
class Components {
    /**
     * Extend a component used by blade.
     * @since 1.0.6
     */
    static extend(component, extender) {
        this._components[component] =
            typeof extender === "function"
                ? extender(this._components[component])
                : extender;
        return this;
    }
    /**
     * Get a component.
     * @param component The component to get.
     * @since 1.0.6
     */
    static get(component) {
        return this._components[component];
    }
}
exports.Components = Components;
Components._components = {
    context: components_1.Context,
    replyBuilder: components_1.ReplyBuilder,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvQ29tcG9uZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFxRDtBQU9yRCxNQUFzQixVQUFVO0lBTTlCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQ2xCLFNBQVksRUFDWixRQUF5QztRQUV6QyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztZQUN6QixPQUFPLFFBQVEsS0FBSyxVQUFVO2dCQUM1QixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBOEIsU0FBWTtRQUN6RCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQzs7QUE3QkgsZ0NBOEJDO0FBN0JnQixzQkFBVyxHQUFnQjtJQUN4QyxPQUFPLEVBQUUsb0JBQU87SUFDaEIsWUFBWSxFQUFFLHlCQUFZO0NBQzNCLENBQUMifQ==