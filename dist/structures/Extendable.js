"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Part_1 = require("./base/Part");
class Extendable extends Part_1.Part {
    constructor(store, dir, file, options = {}) {
        var _a;
        super(store, dir, file, options);
        const staticPropertyNames = Object.getOwnPropertyNames(this.constructor)
            .filter(name => !['length', 'prototype', 'name'].includes(name));
        const instancePropertyNames = Object.getOwnPropertyNames(this.constructor.prototype)
            .filter(name => name !== 'constructor');
        this.staticPropertyDescriptors = Object.assign({}, ...staticPropertyNames
            .map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor, name) })));
        this.instancePropertyDescriptors = Object.assign({}, ...instancePropertyNames
            .map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor.prototype, name) })));
        this.originals = new Map((_a = options.appliesTo) === null || _a === void 0 ? void 0 : _a.map(structure => [structure, {
                staticPropertyDescriptors: Object.assign({}, ...staticPropertyNames
                    .map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure, name) || { value: undefined } }))),
                instancePropertyDescriptors: Object.assign({}, ...instancePropertyNames
                    .map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure.prototype, name) || { value: undefined } })))
            }]));
    }
    init() {
        if (!this.disabled)
            this.enable(true);
    }
    /**
     * Disables this piece
     * @since 0.0.1
     */
    disable() {
        super.disable();
        if (this.client.listenerCount('pieceDisabled'))
            this.client.emit('pieceDisabled', this);
        this.disabled = false;
        for (const [structure, originals] of this.originals) {
            Object.defineProperties(structure, originals.staticPropertyDescriptors);
            Object.defineProperties(structure.prototype, originals.instancePropertyDescriptors);
        }
        return this;
    }
    /**
     * Enables this Component
     * @since 0.0.1
     */
    enable(init = false) {
        if (!init)
            this.store.emit('compEnabled', this);
        this.disabled = false;
        for (const structure of this.originals.keys()) {
            Object.defineProperties(structure, this.staticPropertyDescriptors);
            Object.defineProperties(structure.prototype, this.instancePropertyDescriptors);
        }
        return this;
    }
}
exports.Extendable = Extendable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXh0ZW5kYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0V4dGVuZGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBZ0Q7QUFjaEQsTUFBYSxVQUFXLFNBQVEsV0FBSTtJQW1CbEMsWUFBbUIsS0FBc0IsRUFBRSxHQUFXLEVBQUUsSUFBYyxFQUFFLFVBQTZCLEVBQUU7O1FBQ3ZHLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqQyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0scUJBQXFCLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2FBQ2xGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMseUJBQXlCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxtQkFBbUI7YUFDdkUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RixJQUFJLENBQUMsMkJBQTJCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxxQkFBcUI7YUFDM0UsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsT0FBQyxPQUFPLENBQUMsU0FBUywwQ0FBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRTtnQkFDeEUseUJBQXlCLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxtQkFBbUI7cUJBQ2pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RHLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcscUJBQXFCO3FCQUNyRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoSCxDQUFDLEVBQUUsQ0FBQztJQUNMLENBQUM7SUFFTSxJQUFJO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUE7OztPQUdDO0lBQ0ksT0FBTztRQUNYLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVsQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQztZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLO1FBQ3ZCLElBQUksQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM5QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzdFO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0NBRUQ7QUE3RUQsZ0NBNkVDIn0=