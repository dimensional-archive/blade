/**
 * A storage structure.
 * @since 1.0.0
 */
export declare class Storage<K, V> extends Map<K, V> {
    /**
     * The first item in this Storage
     */
    get first(): [K, V] | null;
    /**
     * The first value of this Storage
     */
    get firstValue(): V | null;
    /**
     * The first key of this Storage
     */
    get firstKey(): K | null;
    /**
     * The last item in this Storage
     */
    get last(): [K, V] | null;
    /**
     * The last value of this Storage
     */
    get lastValue(): V | null;
    /**
     * The last key of this Storage
     */
    get lastKey(): K | null;
    /**
     * Finds an entry from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    find(fn: (value: V, key?: K, map?: this) => boolean, thisArg?: any): V | undefined;
    /**
     * Finds a key from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    findKey(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): K | undefined;
    /**
     * Finds a value from this Storage
     * @param fn Function used to find what you are looking for
     * @param thisArg Optional binding for the fn param
     */
    findValue(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): V | undefined;
    /**
     * Sweeps entries from this Storage
     * @param fn Function used to determine what entries are swept
     * @param thisArg Optional binding for the fn param
     */
    sweep(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): number;
    /**
     * Returns a new filtered Storage based on the filter function
     * @param fn Function used to determine what entries are in the new Storage
     * @param thisArg Optional binding for the fn param
     */
    filter(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): Storage<K, V>;
    /**
     * Maps this Storage to an array (like Array#map())
     * @param fn Function to determine what is mapped to the new Array
     * @param thisArg Optional binding for the fn param
     */
    map<T = any>(fn: (value: V, key: K, map: this) => T, thisArg?: any): T[];
    /**
     * Tests if some entries in this Storage meets a condition
     * @param fn The function to test the condition
     * @param thisArg Optional binding for the fn param
     */
    some(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;
    /**
     * Tests if every entry in this Storage meets a condition
     * @param fn The function to test the condition
     * @param thisArg Optional binding for the fn param
     */
    every(fn: (value: V, key: K, map: this) => boolean, thisArg?: any): boolean;
    /**
     * Reduces this Storage into a singularity
     * @param fn The function to determine how this Storage is reduced
     * @param initialValue The initial value
     * @param thisArg Optional binding for the fn param
     */
    reduce<I>(fn: (accumulator: I, value: V, key: K, map: this) => I, initialValue: I, thisArg?: any): I;
    /**
     * Returns a shallow clone of this Storage
     */
    clone(): Storage<K, V>;
    /**
     * Returns a new Storage with this and other Storages together
     * @param Storages Other Storages to include in the new Storage
     */
    concat(...Storages: Storage<K, V>[]): Storage<K, V>;
    /**
     * Naive equality compare function
     * @param Storage The Storage to compare this against
     */
    equals(Storage: Storage<K, V>): boolean;
    /**
     * Sorts entries in-place in this Storage
     * @param compareFunction Function to determine how this Storage should be sorted
     */
    sort(compareFunction?: (v0: V, v1: V, k0?: K, k1?: K) => number): this;
    /**
     * Sorts entries in a new Storage
     * @param compareFunction Function to determine how the resulting Storage should be sorted
     */
    sorted(compareFunction?: (v0: V, v1: V, k0?: K, k1?: K) => number): Storage<K, V>;
}
