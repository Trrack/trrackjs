type RegistryFunction = <T extends unknown[], R>(...args: T) => R;
type ActionRecord<
  T = any,
  D extends RegistryFunction = any,
  U extends RegistryFunction = any
> = {
  thisArg?: T;
  action: D;
  inverse: U;
};
export class RegistryEntry<
  A extends ActionRecord = any,
  T extends A['thisArg'] = A['thisArg'],
  D extends A['action'] = A['action'],
  U extends A['inverse'] = A['inverse']
> {
  private _thisArg: T;
  private _action: D;
  private _inverse: U;

  constructor({ action, inverse, thisArg }: A) {
    this._thisArg = thisArg || null;
    this._action = action;
    this._inverse = inverse;
  }

  static create<T extends ActionRecord>(action: T) {
    return new RegistryEntry(action);
  }

  apply(...args: Parameters<D>): ReturnType<D> {
    return this._action.apply(this._thisArg, ...args);
  }

  inverse(...args: Parameters<U>): ReturnType<RegistryFunction> {
    return this._inverse.apply(this._thisArg, ...args);
  }
}

export class ActionRegistry<
  Registry extends { [k: string]: RegistryEntry } = any
> {
  private registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  get<K extends keyof Registry>(name: K) {
    return this.registry[name];
  }

  static create<T extends { [k: string]: RegistryEntry }>(
    registry: T
  ): ActionRegistry<T> {
    return new ActionRegistry(registry);
  }
}
