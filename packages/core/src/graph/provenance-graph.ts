/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from '../utils';

import { RootNode } from './components';
import {
    graphSliceCreator,
    ProvenanceGraphAction,
} from './graph-slice';

export type Trigger = 'traversal' | 'new';

export type CurrentChangeHandler = (trigger?: Trigger) => void;
export type CurrentChangeHandlerConfig = {
    skipOnNew: boolean;
};
export type UnsubscribeCurrentChangeListener = () => boolean;

export type ProvenanceGraphStore<
    State = unknown,
    Event extends string = string
> = ReturnType<typeof initializeProvenanceGraph<State, Event>>;

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
    let state = getInitialState();

    function update(action: ProvenanceGraphAction<State, Event>) {
        state = reduce(state, action);

        const isTrackedAction =
            action.type === actions.changeCurrent.type
            || action.type === actions.addNode.type;

        if (!isTrackedAction) return action;

        listeners.forEach((listener) => {
            const isNew = action.type === actions.addNode.type;
            const { skipOnNew } = listener.config;

            if (skipOnNew && isNew) return;

            listener.func(isNew ? 'new' : 'traversal');
        });

        return action;
    }

    return {
        initialState: getInitialState(),
        get backend() {
            return state;
        },
        get current() {
            return state.nodes[state.current];
        },
        get root() {
            return state.nodes[state.root] as RootNode<State>;
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
