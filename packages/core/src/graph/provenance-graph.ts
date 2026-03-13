/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from '../utils';

import { RootNode } from './components';
import { graphSliceCreator, ProvenanceGraphAction } from './graph-slice';

export type Trigger = 'traversal' | 'new';

export type CurrentChangeHandler = (trigger?: Trigger) => void;
export type CurrentChangeHandlerConfig = {
    skipOnNew: boolean;
};
export type UnsubscribeCurrentChangeListener = () => boolean;

export type ProvenanceGraphStore = ReturnType<typeof f>;

const f = () => initializeProvenanceGraph<any, any>({});

export function initializeProvenanceGraph<State, Event extends string>(
    initialState: State
) {
    const listeners: Map<
        string,
        {
            id: string;
            func: CurrentChangeHandler;
            config: CurrentChangeHandlerConfig;
        }
    > = new Map();

    const { reduce, actions, getInitialState } = graphSliceCreator<
        State,
        Event
    >(initialState);

    let backend = getInitialState();

    function notifyCurrentChange(action: ProvenanceGraphAction<State, Event>) {
        if (
            !actions.changeCurrent.match(action) &&
            !actions.addNode.match(action)
        ) {
            return;
        }

        const isNew = actions.addNode.match(action);

        listeners.forEach((listener) => {
            const { skipOnNew } = listener.config;

            if (skipOnNew && isNew) return;

            listener.func(isNew ? 'new' : 'traversal');
        });
    }

    function update(action: ProvenanceGraphAction<State, Event>) {
        backend = reduce(backend, action);
        notifyCurrentChange(action);
        return action;
    }

    return {
        initialState: getInitialState(),
        get backend() {
            return backend;
        },
        get current() {
            return backend.nodes[backend.current];
        },
        get root() {
            return backend.nodes[backend.root] as RootNode<State>;
        },
        currentChange(
            func: CurrentChangeHandler,
            config: CurrentChangeHandlerConfig
        ): UnsubscribeCurrentChangeListener {
            const listener = {
                id: ID.get(),
                func,
                config,
            };
            listeners.set(listener.id, listener);

            return () => listeners.delete(listener.id);
        },
        update,
        ...actions,
    };
}
