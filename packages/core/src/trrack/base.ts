/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Action,
    AnyAction,
    configureStore,
    ConfigureStoreOptions,
    createSlice,
    CreateSliceOptions,
    EnhancedStore,
    SliceCaseReducers,
} from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';

import { GraphUtils, IStateNode } from '../graph';
import { ProvenanceGraph } from '../provenance';
import { ReduxMiddlewares, TrrackStateUpdateOpts } from './types';

export class Trrack<
    S = any,
    A extends Action<any> = AnyAction,
    M extends ReduxMiddlewares<S> = [ThunkMiddleware<S, AnyAction, undefined>]
> {
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
    graph: ProvenanceGraph<S>;

    constructor(opts: ConfigureStoreOptions<S, A, M>) {
        this.store = configureStore(opts);
        this.initialState = this.store.getState();
        this.graph = new ProvenanceGraph(this.initialState);
    }

    get root() {
        return this.graph.root;
    }

    get current() {
        return this.graph.current;
    }

    apply(label: string, action: A, opts?: Partial<TrrackStateUpdateOpts>) {
        const { stateUpdateType = 'Regular', saveMode = 'Auto' } = opts || {};
        this.store.dispatch(action);
        const newState = this.store.getState();
        this.graph.addState(label, { type: 'state', val: newState });
    }

    private applyPatch(opts: any): S {
        console.warn('Implement apply pathch');
        return opts as S;
    }

    getCurrentState() {
        return this.current.state.then((state) => {
            if (state.type === 'state') return state.val;
            else return this.applyPatch(state.val);
        });
    }

    print() {
        const path = GraphUtils.getPath(this.current, this.root);

        for (let i = 0; i < path.length - 1; ++i) {
            const c = path[i];
            const n = path[i + 1];

            console.group(c.id, '---->', n.id);
            console.log(GraphUtils.isNextNodeUp(c, n));
            console.log(GraphUtils.isNextNodeUp(n, c));
            console.groupEnd();
        }
    }

    to(node: IStateNode<S>): void {
        const path = GraphUtils.getPath(this.current, node);
        console.table(path);
    }
    undo(): void {}
    redo(): void {}
}
