/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionMap, IActionFunction, IActionRegistry } from './types';

export class ActionRegistry<T extends ActionFunctionMap>
    implements IActionRegistry<T>
{
    private constructor(private _registry: T) {}

    register<K extends string, S extends IActionFunction<any>>(
        name: K,
        action: S
    ): IActionRegistry<Record<K, S> & T> {
        (this._registry as any)[name] = action;
        return this as unknown as IActionRegistry<Record<K, S> & T>;
    }

    get registry() {
        return this._registry;
    }

    get<K extends keyof T>(key: K): T[K] {
        return this._registry[key];
    }

    static init() {
        return new ActionRegistry({});
    }
}
