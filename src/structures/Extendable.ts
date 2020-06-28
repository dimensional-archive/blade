import { Part, PartOptions } from "./base/Component";
import { ExtendableStore } from "./ExtendableStore";

export type Constructor<T = unknown> = new (...args: readonly unknown[]) => T;

export interface ExtendableOptions extends PartOptions {
	appliesTo?: readonly Constructor[];
}

export interface OriginalPropertyDescriptors {
	staticPropertyDescriptors: Record<string, PropertyDescriptor>;
	instancePropertyDescriptors: Record<string, PropertyDescriptor>;
}

export class Extendable extends Part {
  /**
	 * The static property descriptors of this extendable
	 * @since 1.0.7
	 */
	private staticPropertyDescriptors: Record<string, PropertyDescriptor>;

	/**
	 * The instance property descriptors of this extendable
	 * @since 1.0.7
	 */
	private instancePropertyDescriptors: Record<string, PropertyDescriptor>;

	/**
	 * The original property descriptors for each of the original classes
	 * @since 1.0.7
	 */
  private originals: Map<any, OriginalPropertyDescriptors>;
  
  public constructor(store: ExtendableStore, dir: string, file: string[], options: ExtendableOptions = {}) {
		super(store, dir, file, options);

		const staticPropertyNames = Object.getOwnPropertyNames(this.constructor)
			.filter(name => !['length', 'prototype', 'name'].includes(name));
		const instancePropertyNames = Object.getOwnPropertyNames(this.constructor.prototype)
			.filter(name => name !== 'constructor');

		this.staticPropertyDescriptors = Object.assign({}, ...staticPropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor, name) })));

		this.instancePropertyDescriptors = Object.assign({}, ...instancePropertyNames
			.map(name => ({ [name]: Object.getOwnPropertyDescriptor(this.constructor.prototype, name) })));

		this.originals = new Map(options.appliesTo?.map(structure => [structure, {
			staticPropertyDescriptors: Object.assign({}, ...staticPropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure, name) || { value: undefined } }))),
			instancePropertyDescriptors: Object.assign({}, ...instancePropertyNames
				.map(name => ({ [name]: Object.getOwnPropertyDescriptor(structure.prototype, name) || { value: undefined } })))
		}]));
  }

  public init() {
    if (!this.disabled) this.enable(true);
  }
  
  	/**
	 * Disables this piece
	 * @since 0.0.1
	 */
	public disable(): this {
    super.disable();

		if (this.client.listenerCount('pieceDisabled')) this.client.emit('pieceDisabled', this);
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
	public enable(init = false): this {
    if (!init) this.store.emit('compEnabled', this);

    this.disabled = false;
		for (const structure of this.originals.keys()) {
			Object.defineProperties(structure, this.staticPropertyDescriptors);
			Object.defineProperties(structure.prototype, this.instancePropertyDescriptors);
    }
    
		return this;
	}

}