import { ActionFunctionMap } from '..';
import { GenericArgs } from '../../utils';
import { ApplyActionObject, TrrackAction, TrrackActionFunction } from '../action';

export type LabelGenerator<TArgs extends GenericArgs = any[]> = (
    ...args: TArgs
) => string;

export class ActionRegistry<
    T extends ActionFunctionMap,
    TLabelGenerator extends Record<
        keyof T,
        LabelGenerator<Parameters<T[keyof T]>>
    > = Record<keyof T, LabelGenerator<Parameters<T[keyof T]>>>
> {
    static init<
        T extends ActionFunctionMap = Record<string, any>,
        TLabelGenerator extends Record<
            keyof T,
            LabelGenerator<Parameters<T[keyof T]>>
        > = Record<keyof T, LabelGenerator<Parameters<T[keyof T]>>>
    >(reg?: T, labelGen?: TLabelGenerator): ActionRegistry<T> {
        return new ActionRegistry<T>(reg, labelGen);
    }

    private constructor(
        private _registry: T = {} as T,
        private _labelGenerators = {} as TLabelGenerator
    ) {}

    register<
        K extends string,
        S extends TrrackActionFunction<any, any, any>,
        TLabelGen extends LabelGenerator<Parameters<S>>
    >(
        name: K,
        action: S,
        labelGen: TLabelGen
    ): ActionRegistry<Record<K, S> & T> {
        if (this._registry[name])
            throw new Error(`Action ${name} already registered.`);

        return ActionRegistry.init<Record<K, S> & T>(
            {
                ...this._registry,
                [name]: action,
            },
            {
                ...this._labelGenerators,
                [name]: labelGen,
            }
        );
    }

    get<K extends keyof T>(name: K) {
        return this._registry[name];
    }

    get registeredActions(): string[] {
        return Object.keys(this._registry);
    }

    getLabel<K extends keyof T>({
        name,
        args,
    }: ApplyActionObject<Extract<K, string>, Parameters<T[K]>>) {
        return this._labelGenerators[name](...args);
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
