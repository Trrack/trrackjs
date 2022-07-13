import { ApplyActionObject, TrrackAction, TrrackActionFunction } from '../action';

export type ActionFunctionMap = Record<
    string,
    TrrackActionFunction<any, any, any>
>;

export interface IActionRegistry<T extends ActionFunctionMap> {
    readonly registry: T;

    register<K extends string, S extends TrrackActionFunction<any, any, any>>(
        name: K,
        action: S
    ): IActionRegistry<Record<K, S> & T>;

    get<K extends keyof T>(name: K): T[K];

    apply<K extends keyof T>(
        applyObject: ApplyActionObject<Extract<K, string>, Parameters<T[K]>>
    ): TrrackAction<any, any, any, any>;
}
