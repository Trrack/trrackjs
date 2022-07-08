import { ActionFunctionMap, IActionRegistry } from '..';
import { ApplyActionObject, TrrackAction, TrrackActionFunction } from '../action';

export class ActionRegistry<T extends ActionFunctionMap>
    implements IActionRegistry<T>
{
    static init<T extends ActionFunctionMap = Record<string, any>>(
        reg?: T
    ): IActionRegistry<T> {
        return new ActionRegistry<T>(reg);
    }

    private constructor(readonly registry: T = {} as T) {}

    register<K extends string, S extends TrrackActionFunction<any, any, any>>(
        name: K,
        action: S
    ): IActionRegistry<Record<K, S> & T> {
        console.log('Add checks');
        return ActionRegistry.init<Record<K, S> & T>({
            ...this.registry,
            [name]: action,
        });
    }

    get<K extends keyof T>(name: K) {
        return this.registry[name];
    }

    apply<K extends keyof T>({
        name,
        args,
    }: ApplyActionObject<Extract<K, string>, Parameters<T[K]>>): TrrackAction<
        any,
        any,
        any,
        any
    > {
        const action = this.get(name);
        const actionResult = action(...(args as any[]));

        return {
            do: {
                name,
                args,
            },
            undo: {
                ...actionResult,
            },
        };
    }
}
