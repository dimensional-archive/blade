"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./base/Component");
class Extendable extends Component_1.Part {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXh0ZW5kYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL0V4dGVuZGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBcUQ7QUFjckQsTUFBYSxVQUFXLFNBQVEsZ0JBQUk7SUFtQmxDLFlBQW1CLEtBQXNCLEVBQUUsR0FBVyxFQUFFLElBQWMsRUFBRSxVQUE2QixFQUFFOztRQUN2RyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakMsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQzthQUNsRixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsbUJBQW1CO2FBQ3ZFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEYsSUFBSSxDQUFDLDJCQUEyQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcscUJBQXFCO2FBQzNFLEdBQUcsQ0FBQyxJQUFJLENB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