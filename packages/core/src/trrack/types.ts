import { Action, AnyAction, Middleware } from '@reduxjs/toolkit';

import { IStateNode } from '../graph';
import { TrrackStateSaveMode, TrrackStateUpdateType } from '../provenance';

export type ReduxMiddlewares<T> = ReadonlyArray<
    Middleware<Record<string, never>, T>
>;

export type TrrackStateUpdateOpts = {
    stateUpdateType: TrrackStateUpdateType;
    saveMode: TrrackStateSaveMode;
};

export interface ITrrack<S = any, A extends Action<any> = AnyAction> {
    root: IStateNode<S>;
    current: IStateNode<S>;
    apply(
        label: string,
        action: A,
        opts?: Partial<TrrackStateUpdateOpts>
    ): void;
    print(): void;
    getCurrentState(): PromiseLike<S>;
    to(node: IStateNode<S>): void;
    undo(): void;
    redo(): void;
}
