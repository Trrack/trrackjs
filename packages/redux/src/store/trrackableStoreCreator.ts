/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Action,
    ActionCreatorWithoutPayload,
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
    const slices: Array<{ key: string; slice: Slice }> = [];

    for (const sliceKey in sliceMap) {
        const slice = sliceMap[sliceKey];

        slices.push({
            key: sliceKey,
            slice,
        });
    }

    return slices.reduce((acc, slc) => {
        const scr: SliceCaseReducers<any> = {
            [slc.key]: slc.slice.reducer,
        };

        // Object.entries(slice.actions).forEach(([key, action]) => {
        //     scr[action.type] = slice.caseReducers[key];
        // });

        return { ...acc, ...scr };
    }, {} as { [K in keyof State]: SliceMap<State>[K]['reducer'] });
}

export function __mergeActionToSliceName(slices: Slice[]) {
    return slices.reduce((acc, slice) => {
        const scr: { [key: string]: string } = {};

        Object.values(slice.actions).forEach((action) => {
            scr[action.type] = slice.name;
        });

        return { ...acc, ...scr };
    }, {} as { [key: string]: string });
}

type SliceMap<State> = {
    [K in keyof State]: Slice<State[K]> | TrrackableSlice<State[K]>;
};

function trrackActionCheckerCreator(
    actions: Array<ActionCreatorWithoutPayload>
) {
    // Run the middleware if the action is trracked, trrack is not traversing and middleware is not paused.
    return isAnyOf(actions[0], ...actions);
}

function extractTrrackedState<State>(
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
    return state as any;
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

type MiddlewareRunState = 'active' | 'paused';

export function configureTrrackableStore<State>(
    opts: Omit<ConfigureStoreOptions<State, AnyAction>, 'reducer'> & {
        sliceMap: SliceMap<State>;
    }
) {
    const slices: Slice[] = Object.values(opts.sliceMap);

    const reducerMap = mergeReducers(opts.sliceMap);

    const reducer = makeTrrackable(combineReducers(reducerMap)) as any;

    const trrackListenerMiddleware = createListenerMiddleware();

    const reduxStore = configureStore({
        ...opts,
        reducer,
        middleware(getDefaultMiddleware) {
            const suppliedMiddleware = opts.middleware;

            if (!suppliedMiddleware) {
                return getDefaultMiddleware().prepend(
                    trrackListenerMiddleware.middleware
                );
            }

            if (typeof suppliedMiddleware === 'function') {
                return [
                    ...suppliedMiddleware(getDefaultMiddleware),
                    trrackListenerMiddleware.middleware,
                ];
            }

            return [...suppliedMiddleware, trrackListenerMiddleware.middleware];
        },
    });

    /**
     * Create types for listener
     */
    type RootState = ReturnType<typeof reduxStore.getState>;
    type AppDispatch = typeof reduxStore.dispatch;

    type AppStartListening = TypedStartListening<RootState, AppDispatch>;
    const startListening =
        trrackListenerMiddleware.startListening as AppStartListening;
    // Fin.

    const labels = mergeLabels(slices);
    const doUndoActionCreators = mergeDoUndoActionCreators(slices);
    const reducerEventTypes = mergeReducerEventTypes(slices);
    const asyncThunks = mergeAsyncThunks(slices);
    const trrackedActions = mergeTrrackedActions(slices);
    const isActionTrracked = trrackActionCheckerCreator(trrackedActions);

    const trrackedState = extractTrrackedState(
        reduxStore.getState(),
        opts.sliceMap
    );

    const trrackInstance = initializeTrrack({
        initialState: trrackedState,
        registry: Registry.create(),
    });

    let middlewareStatus: MiddlewareRunState = 'active';

    for (const key in asyncThunks) {
        const thunk = asyncThunks[key];
        if (!trrackInstance.registry.has(thunk.typePrefix)) {
            trrackInstance.registry.register(
                thunk.typePrefix,
                async (args: any) => {
                    middlewareStatus = 'paused';
                    const th = await reduxStore.dispatch(thunk(args) as any);
                    middlewareStatus = 'active';
                    return th;
                }
            );
        }
    }

    slices.forEach((slice) => {
        for (const actionName in slice.actions) {
            const action = slice.actions[actionName];

            if (!trrackInstance.registry.has(action.type)) {
                trrackInstance.registry.register(
                    action.type,
                    (act: AnyAction) => {
                        return reduxStore.dispatch(act);
                    }
                );
            }
        }
    });

    const trrackStore = getTrrackStore({
        current: trrackInstance.current.id,
    });

    trrackInstance.currentChange(() => {
        middlewareStatus = 'paused';

        const state = reduxStore.getState();
        reduxStore.dispatch(
            trrackTraverseAction({ ...state, ...trrackInstance.getState() })
        );
        trrackStore.dispatch(changeCurrent(trrackInstance.current.id));

        middlewareStatus = 'active';
    });

    startListening({
        predicate(action) {
            if (trrackInstance.isTraversing) return false;

            if (middlewareStatus === 'paused') return false;

            if (isAsyncThunkAction(action)) {
                return isFulfilled(action);
            }

            return isActionTrracked(action);
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
                currentState: extractTrrackedState(
                    api.getState(),
                    opts.sliceMap
                ),
                previousState: extractTrrackedState(
                    api.getOriginalState(),
                    opts.sliceMap
                ),
            });

            const hasSideEffects = !NO_OP_ACTION.match(doUndoObject.undo);

            if (hasSideEffects) {
                const undoAct = doUndoObject.undo as PayloadAction;
                const doAct = NO_OP_ACTION.match(doUndoObject.do)
                    ? (action as PayloadAction)
                    : (doUndoObject.do as PayloadAction);

                trrackInstance.record({
                    label,
                    state: extractTrrackedState(api.getState(), opts.sliceMap),
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
                trrackInstance.record({
                    label,
                    state: extractTrrackedState(api.getState(), opts.sliceMap),
                    eventType: reducerEventTypes[type],
                    sideEffects: {
                        do: [],
                        undo: [],
                    },
                });
            }
        },
    });

    return { store: reduxStore, trrack: trrackInstance, trrackStore };
}
