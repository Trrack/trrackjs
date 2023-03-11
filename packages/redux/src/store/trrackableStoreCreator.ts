/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Action,
    AnyAction,
    AsyncThunk,
    combineReducers,
    configureStore,
    ConfigureStoreOptions,
    createAction,
    createListenerMiddleware,
    isAnyOf,
    isAsyncThunkAction,
    isFulfilled,
    PayloadAction,
    PayloadActionCreator,
    Reducer,
    Slice,
    SliceCaseReducers,
    TypedStartListening,
} from '@reduxjs/toolkit';
import { initializeTrrack, Registry } from '@trrack/core';

import { isSliceTrrackable } from '../slice';
import {
    ACTION_NAME_TYPE_MAP,
    ASYNC_THUNKS,
    DO_UNDO_ACTION_CREATORS,
    GeneratedDoUndoActionCreators,
    LabelGenerators,
    LABELS,
    NO_OP_ACTION,
    TrrackableSlice,
} from '../slice/types';
import { changeCurrent, getTrrackStore } from './trrackStore';
import { Trrackable } from './types';

// Fin.

export const trrackTraverseAction = createAction('traverse', function prepare<
    T
>(state: T) {
    return {
        payload: state,
    };
});

function isTraverseAction(
    action: AnyAction
): action is ReturnType<typeof trrackTraverseAction> {
    return action.type === trrackTraverseAction.type;
}

function makeTrrackable<State, A extends Action = AnyAction>(
    reducer: Reducer<State, A>
) {
    return function (state: State | undefined, action: A) {
        if (isTraverseAction(action))
            return reducer(action.payload as State, action);
        return reducer(state, action);
    };
}

function mergeLabels(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        if (isSliceTrrackable(slice)) {
            return { ...acc, ...slice[LABELS] };
        }
        return acc;
    }, {} as LabelGenerators);
}

function mergeDoUndoActionCreators(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        if (isSliceTrrackable(slice)) {
            return { ...acc, ...slice[DO_UNDO_ACTION_CREATORS] };
        }
        return acc;
    }, {} as GeneratedDoUndoActionCreators);
}

function mergeReducerEventTypes(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        if (isSliceTrrackable(slice)) {
            return { ...acc, ...slice[ACTION_NAME_TYPE_MAP] };
        }
        return acc;
    }, {} as { [key: string]: string });
}

function mergeAsyncThunks(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        if (isSliceTrrackable(slice)) {
            const asyncs: { [key: string]: AsyncThunk<any, any, any> } = {};

            slice[ASYNC_THUNKS].forEach((thunk) => {
                asyncs[thunk.typePrefix] = thunk;
                asyncs[thunk.fulfilled.type] = thunk;
            });

            return { ...acc, ...asyncs };
        }
        return acc;
    }, {} as { [key: string]: AsyncThunk<any, any, any> });
}

function mergeTrrackedActions(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        if (isSliceTrrackable(slice)) {
            return [
                ...acc,
                ...(Object.values(
                    slice.actions
                ) as Array<PayloadActionCreator>),
            ];
        }
        return acc;
    }, [] as Array<PayloadActionCreator>);
}

function mergeReducers<State>(sliceMap: SliceMap<State>) {
    const slices = Object.values(sliceMap) as Slice[];
    return slices.reduce((acc, slice) => {
        const scr: SliceCaseReducers<any> = {
            [slice.name]: slice.reducer,
        };

        // Object.entries(slice.actions).forEach(([key, action]) => {
        //     scr[action.type] = slice.caseReducers[key];
        // });

        return { ...acc, ...scr };
    }, {} as { [K in keyof State]: SliceMap<State>[K]['reducer'] });
}

function mergeActionToSliceName(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        const scr: { [key: string]: string } = {};

        Object.values(slice.actions).forEach((action) => {
            scr[action.type] = slice.name;
        });

        return { ...acc, ...scr };
    }, {} as { [key: string]: string });
}

function trrackedState<State>(
    state: State,
    sliceMap: SliceMap<State>
): Trrackable<State> {
    const slices: Slice[] = Object.values(sliceMap);

    for (const key in state) {
        const k = key as keyof State;
        const slice = slices.find((s) => s.name === k);
        if (slice && !isSliceTrrackable(slice)) {
            delete state[k];
        }
    }
    return state;
}

type SliceMap<State> = {
    [K in keyof State]: Slice<State[K]> | TrrackableSlice<State[K]>;
};

export function configureTrrackableStore<State>(
    opts: ConfigureStoreOptions<State, AnyAction> & {
        sliceMap: SliceMap<State>;
    }
) {
    const slices: Slice[] = Object.values(opts.sliceMap);
    const trrackMiddleware = createListenerMiddleware();

    const _reducer = mergeReducers(opts.sliceMap);

    const store = configureStore({
        ...opts,
        reducer: makeTrrackable(
            typeof _reducer === 'function'
                ? _reducer
                : (combineReducers(_reducer) as any)
        ),
        middleware(getDefaultMiddleware) {
            const suppliedMiddleware = opts.middleware;
            if (!suppliedMiddleware)
                return getDefaultMiddleware().prepend(
                    trrackMiddleware.middleware
                );
            if (typeof suppliedMiddleware === 'function') {
                return [
                    ...suppliedMiddleware(getDefaultMiddleware),
                    trrackMiddleware.middleware,
                ];
            }
            return [...suppliedMiddleware, trrackMiddleware.middleware];
        },
    });

    /**
     * Create types for listener
     */
    type RootState = ReturnType<typeof store.getState>;
    type AppDispatch = typeof store.dispatch;

    type AppStartListening = TypedStartListening<RootState, AppDispatch>;
    const startListening = trrackMiddleware.startListening as AppStartListening;
    // Fin.

    const labels = mergeLabels(slices);
    const doUndoActionCreators = mergeDoUndoActionCreators(slices);
    const reducerEventTypes = mergeReducerEventTypes(slices);
    const asyncThunks = mergeAsyncThunks(slices);
    const trrackedActions = mergeTrrackedActions(slices);

    const newState = trrackedState(store.getState(), opts.sliceMap);

    console.log(newState);

    const trrack = initializeTrrack({
        initialState: store.getState(),
        registry: Registry.create(),
    });

    let middlewareStatus: 'active' | 'paused' = 'active';

    Object.values(asyncThunks).forEach((thunk) => {
        if (!trrack.registry.has(thunk.typePrefix)) {
            trrack.registry.register(thunk.typePrefix, (args: any) => {
                middlewareStatus = 'paused';
                const th = store.dispatch(thunk(args) as any);
                return th.then(() => (middlewareStatus = 'active'));
            });
        }
    });

    slices.forEach((slice) => {
        Object.values(slice.actions).forEach((action) => {
            trrack.registry.register(action.type, ((act: AnyAction) => {
                return store.dispatch(act);
            }) as any);
        });
    });

    const trrackStore = getTrrackStore({
        current: trrack.current.id,
    });

    trrack.currentChange(() => {
        middlewareStatus = 'paused';
        store.dispatch(trrackTraverseAction(trrack.getState()));
        trrackStore.dispatch(changeCurrent(trrack.current.id));
        middlewareStatus = 'active';
    });

    startListening({
        predicate(action) {
            if (trrack.isTraversing) return false; // Never run middleware when trrack is traversing.

            if (middlewareStatus === 'paused') return false; // Never run middleware when middleware is set to pause.

            // Check if given actions is fulfilled async thunk action and only then return true.
            if (isAsyncThunkAction(action)) {
                return isFulfilled(action);
            }

            // Run the middleware if the action is trracked, trrack is not traversing and middleware is not paused.
            const isTrrackedAction = isAnyOf(
                trrackedActions[0],
                ...trrackedActions
            );
            return isTrrackedAction(action);
        },
        effect(action, api) {
            const isThunk = isFulfilled(action);

            const type = isThunk
                ? asyncThunks[action.type].typePrefix
                : action.type;
            const payload = action['payload'];
            const labelGenerator = labels[type];

            const label = labelGenerator(payload);

            const doUndoObject = doUndoActionCreators[type]({
                action: action as PayloadAction,
                currentState: api.getState(),
                previousState: api.getOriginalState(),
            });

            const hasSideEffects = !NO_OP_ACTION.match(doUndoObject.undo);

            if (hasSideEffects) {
                const undoAct = doUndoObject.undo as PayloadAction;
                const doAct = NO_OP_ACTION.match(doUndoObject.do)
                    ? (action as PayloadAction)
                    : (doUndoObject.do as PayloadAction);

                trrack.record({
                    label,
                    state: api.getState(),
                    eventType: reducerEventTypes[type],
                    sideEffects: {
                        do: [
                            {
                                type: isThunk ? type : doAct.type,
                                payload: isThunk ? doAct.payload : doAct,
                            },
                        ],
                        undo: [
                            {
                                type: undoAct.type,
                                payload: isThunk ? undoAct.payload : undoAct,
                            },
                        ],
                    },
                    onlySideEffects: true,
                });
            } else {
                // ! Fix

                trrack.record({
                    label,
                    state: api.getState(),
                    eventType: reducerEventTypes[type],
                    sideEffects: {
                        do: [],
                        undo: [],
                    },
                });
            }
        },
    });

    return { store, trrack, trrackStore };
}
