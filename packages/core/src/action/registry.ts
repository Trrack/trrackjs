/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionMap, ExplicitUndoRecord, IActionFunction, IActionRegistry, UndoFunction } from './types';

export class ActionRegistry<T extends ActionFunctionMap>
    implements IActionRegistry<T>
{
    private constructor(private _registry: T) {}

    register<
        K extends string,
        S extends IActionFunction<any>,
        I extends UndoFunction<S> = UndoFunction<S>
    >(
        name: K,
        action: S,
        inverse?: I
    ): IActionRegistry<(Record<K, S> & T) | (ExplicitUndoRecord<K, S, I> & T)> {
        (this._registry as any)[name] = action;
        if (!inverse) {
            return this as unknown as IActionRegistry<Record<K, S> & T>;
        } else {
            (this._registry as any)[name] = action;
            (this._registry as any)[`${name}_undo`] = inverse;

            return this as unknown as IActionRegistry<
                Record<K, S> & Record<`${K}_undo`, I> & T
            >;
        }
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
