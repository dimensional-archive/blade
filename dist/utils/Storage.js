"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
/**
 * A storage structure.
 * @since 1.0.0
 */
class Storage extends Map {
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
exports.Storage = Storage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9TdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILE1BQWEsT0FBYyxTQUFRLEdBQVM7SUFDMUM7O09BRUc7SUFDSCxJQUFXLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdkQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3JELENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsSUFBSTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNqRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsT0FBTztRQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsRUFBOEMsRUFBRSxPQUFhO1FBQ3ZFLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVztZQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFELEtBQUssTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsSUFBSSxJQUFJO1lBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUM7UUFDcEUsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxPQUFPLENBQUMsRUFBNEMsRUFBRSxPQUFhO1FBQ3hFLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVztZQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFELEtBQUssTUFBTSxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsSUFBSSxJQUFJO1lBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUM7UUFDcEUsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsRUFBNEMsRUFBRSxPQUFhO1FBQzFFLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVztZQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FB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