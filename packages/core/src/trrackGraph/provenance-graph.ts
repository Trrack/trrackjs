/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    configureStore,
    createListenerMiddleware,
    isAnyOf,
} from '@reduxjs/toolkit';
import { ID } from '../utils';

import { RootNode } from './components';

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

    const { reducer, actions, getInitialState } = graphSliceCreator<
        State,
        Event
    >(initialState);

    const listenerMiddleware = createListenerMiddleware();

    listenerMiddleware.startListening({
        matcher: isAnyOf(actions.changeCurrent, actions.addNode),
        effect: (action, listenerApi) => {
            listenerApi.cancelActiveListeners();
            listeners.forEach((listener) => {
                const isNew = isAnyOf(actions.addNode)(action);
                const { skipOnNew } = listener.config;

                if (skipOnNew && isNew) return;

                listener.func(isNew ? 'new' : 'traversal');
            });
        },
    });

    const store = configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    });

    return {
        initialState: getInitialState(),
        get backend() {
            return store.getState();
        },
        get current() {
            return store.getState().nodes[store.getState().current];
        },
        get root() {
            return store.getState().nodes[
                store.getState().root
            ] as RootNode<State>;
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
        update: store.dispatch,
        ...actions,
    };
}
