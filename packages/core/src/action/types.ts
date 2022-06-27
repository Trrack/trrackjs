/* eslint-disable @typescript-eslint/no-explicit-any */
export type GenericArgs = readonly unknown[];

export type GenericFunction<Args extends GenericArgs, R = void> = (
    ...args: Args
) => R;

export type IActionFunctionResults<UndoArgs extends GenericArgs> = {
    inverse: {
        f_id: string;
        parameters: UndoArgs;
    };
};

export interface IActionFunction<Args extends GenericArgs> {
    (...args: Args): IActionFunctionResults<Args>;
}

export type UndoFunction<DoFunction extends IActionFunction<any>> =
    GenericFunction<ReturnType<DoFunction>['inverse']['parameters']>;

/** internal use only */
export type ActionFunctionMap = { [k: string]: IActionFunction<any> };

/** internal use only */
export type ExplicitUndoRecord<K extends string, S, I> = Record<K, S> &
    Record<`${K}_undo`, I>;

export interface IActionRegistry<T extends ActionFunctionMap> {
    readonly registry: T;
    register<K extends string, S extends IActionFunction<any>>(
        name: K,
        action: S
    ): IActionRegistry<Record<K, S> & T>;

    register<
        K extends string,
        S extends IActionFunction<any>,
        I extends UndoFunction<S> = UndoFunction<S>
    >(
        name: K,
        action: S,
        inverse: I
    ): IActionRegistry<ExplicitUndoRecord<K, S, I> & T>;
    get<K extends keyof T>(key: K): T[K];
}

export type TrrackAction<
    DoAction extends string,
    UndoAction extends string,
    DoArgs extends GenericArgs,
    UndoArgs extends GenericArgs
> = {
    label: string;
    do: {
        name: DoAction;
        args: DoArgs;
    };
    undo: {
        name: UndoAction;
        args: UndoArgs;
    };
};
