/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    configureStore,
    createListenerMiddleware,
    isAnyOf,
} from '@reduxjs/toolkit';

import { RootNode } from './components';
import { graphSliceCreator } from './graph-slice';

export function initializeProvenanceGraph<S>(initialState: S) {
    let listeners: any[] = [];

    const { reducer, actions, getInitialState } =
        graphSliceCreator(initialState);

    const listenerMiddleware = createListenerMiddleware();

    listenerMiddleware.startListening({
        matcher: isAnyOf(actions.changeCurrent, actions.addNode),
        effect: (action, listenerApi) => {
            listenerApi.cancelActiveListeners();
            listeners.forEach((l) => l());
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
            return store.getState().nodes[store.getState().root] as RootNode<S>;
        },
        currentChange(listener: any) {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            };
        },
        update: store.dispatch,
        ...actions,
    };
}
