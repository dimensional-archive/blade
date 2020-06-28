"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A storage structure.
 * @since 1.0.0
 */
class Collection extends Map {
    /**
     * The first item in this Storage
     */
    get first() {
        return this.size ? this.entries().next().value : null;
    }
    /**
     * The first value of this Storage
     */
    get firstValue() {
        return this.size ? this.values().next().value : null;
    }
    /**
     * The first key of this Storage
     */
    get firstKey() {
        return this.size ? this.keys().next().value : null;
    }
    /**
     * The last item in this Storage
     */
    get last() {
        return this.size ? [...this.entries()][this.size - 1] : null;
    }
    /**
     * The last value of this Storage
     */
    get lastValue() {
        return this.size ? [...this.values()][this.size - 1] : null;
    }
    /**
     * The last key of this Storage
     */
    get lastKey() {
        return this.size ? [...this.keys()][this.size - 1] : null;
    }
    /**
     * Finds an entry from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    find(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this)
            if (fn(val, key, this))
                return val;
        return undefined;
    }
    /**
     * Finds a key from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    findKey(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this)
            if (fn(val, key, this))
                return key;
        return undefined;
    }
    /**
     * Finds a value from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    findValue(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this)
            if (fn(val, key, this))
                return val;
        return undefined;
    }
    /**
     * Sweeps entries from this Storage
     * @param fn Function used to determine what entries are swept
     * @param thisArg Optional binding for the fn param
     */
    sweep(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this)
            if (fn(val, key, this))
                this.delete(key);
        return previousSize - this.size;
    }
    /**
     * Returns a new filtered Storage based on the filter function
     * @param fn Function used to determine what entries are in the new Storage
     * @param thisArg Optional binding for the fn param
     */
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            if (fn(val, key, this))
                results.set(key, val);
        return results;
    }
    /**
     * Maps this Storage to an array (like Array#map())
     * @param fn Function to determine what is mapped to the new Array
     * @param thisArg Optional binding for the fn param
     */
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const arr = [];
        let i = 0;
        for (const [key, val] of this)
            arr[i++] = fn(val, key, this);
        return arr;
    }
    /**
     * Tests if some entries in this Storage meets a condition
     * @param fn The function to test the condition
     * @param thisArg Optional binding for the fn param
     */
    some(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this)
            if (fn(val, key, this))
                return true;
        return false;
    }
    /**
     * Tests if every entry in this Storage meets a condition
     * @param fn The function to test the condition
     * @param thisArg Optional binding for the fn param
     */
    every(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this)
            if (!fn(val, key, this))
                return false;
        return true;
    }
    /**
     * Reduces this Storage into a singularity
     * @param fn The function to determine how this Storage is reduced
     * @param initialValue The initial value
     * @param thisArg Optional binding for the fn param
     */
    reduce(fn, initialValue, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        let accumulator = initialValue;
        for (const [key, val] of this)
            accumulator = fn(accumulator, val, key, this);
        return accumulator;
    }
    /**
     * Returns a shallow clone of this Storage
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Returns a new Storage with this and other Storages together
     * @param Storages Other Storages to include in the new Storage
     */
    concat(...Storages) {
        const newColl = this.clone();
        for (const coll of Storages)
            for (const [key, val] of coll)
                newColl.set(key, val);
        return newColl;
    }
    /**
     * Naive equality compare function
     * @param Storage The Storage to compare this against
     */
    equals(Storage) {
        return this === Storage || (this.size === Storage.size && this.every((value, key) => Storage.get(key) === value));
    }
    /**
     * Sorts entries in-place in this Storage
     * @param compareFunction Function to determine how this Storage should be sorted
     */
    sort(compareFunction = (first, second) => +(first > second) || +(first === second) - 1) {
        const entries = [...this.entries()]
            .sort((e0, e1) => compareFunction(e0[1], e1[1], e0[0], e1[0]));
        this.clear();
        for (const [key, value] of entries)
            this.set(key, value);
        return this;
    }
    /**
     * Sorts entries in a new Storage
     * @param compareFunction Function to determine how the resulting Storage should be sorted
     */
    sorted(compareFunction = (first, second) => +(first > second) || +(first === second) - 1) {
        const entries = [...this.entries()]
            .sort((e0, e1) => compareFunction(e0[1], e1[1], e0[0], e1[0]));
        return new this.constructor(entries);
    }
}
exports.Collection = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL1N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7O0dBR0c7QUFDSCxNQUFhLFVBQWlCLFNBQVEsR0FBUztJQUM3Qzs7T0FFRztJQUNILElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hELENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxJQUFJO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMs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