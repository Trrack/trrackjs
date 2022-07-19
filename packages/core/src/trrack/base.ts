import {
    Action,
    AnyAction,
    configureStore,
    ConfigureStoreOptions,
    createSlice,
    CreateSliceOptions,
    EnhancedStore,
    Middleware,
    SliceCaseReducers,
} from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';

import { IProvenanceGraph, ProvenanceGraph, TrrackStateSaveMode, TrrackStateUpdateType } from '../provenance';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ReduxMiddlewares<T> = ReadonlyArray<Middleware<Record<string, never>, T>>;

type TrrackStateUpdateOpts = {
    stateUpdateType: TrrackStateUpdateType;
    saveMode: TrrackStateSaveMode;
};

export class Trrack<
    S = any,
    A extends Action<any> = AnyAction,
    M extends ReduxMiddlewares<S> = [ThunkMiddleware<S, AnyAction, undefined>]
> {
    static init<
        S = any,
        A extends Action<any> = AnyAction,
        M extends ReduxMiddlewares<S> = [
            ThunkMiddleware<S, AnyAction, undefined>
        ]
    >(opts: ConfigureStoreOptions<S, A, M>) {
        return new Trrack<S, A, M>(opts);
    }

    static createState<
        State,
        CaseReducers extends SliceCaseReducers<State>,
        Name extends string = string
    >(opts: CreateSliceOptions<State, CaseReducers, Name>) {
        const slice = createSlice(opts);

        return {
            reducer: slice.reducer,
            actions: slice.actions,
        };
    }
    // ! Check for redux integration
    store: EnhancedStore<S, A, M>;
    initialState: S;
    graph: IProvenanceGraph<S>;

    constructor(opts: ConfigureStoreOptions<S, A, M>) {
        this.store = configureStore(opts);
        this.initialState = this.store.getState();
        this.graph = ProvenanceGraph.create(this.initialState);
    }

    apply(label: string, action: A, opts?: Partial<TrrackStateUpdateOpts>) {
        const { stateUpdateType = 'Regular', saveMode = 'Auto' } = opts || {};
        this.store.dispatch(action);
        const newState = this.store.getState();
        this.graph.addState(label, { type: 'state', val: newState });
    }

    print() {
        console.log(this.store.getState());
    }
}
