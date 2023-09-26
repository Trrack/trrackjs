import {
    ActionCreatorWithPayload,
    AsyncThunk,
    CaseReducerActions,
    createAction,
    PayloadAction,
    PayloadActionCreator,
    Slice,
    SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Label, LabelGenerator } from '@trrack/core';

export type LabelLike<CaseReducers extends SliceCaseReducers<any>> = Partial<{
    [K in keyof CaseReducerActions<CaseReducers, any>]: CaseReducerActions<
        CaseReducers,
        any
    >[K] extends PayloadActionCreator<infer P>
        ? Label | LabelGenerator<P>
        : never;
}>;

export type LabelGenerators = {
    [key: string]: LabelGenerator<any>;
};

/**
 * Events
 */
export type ReducerEventTypes<
    Event extends string,
    CaseReducers extends SliceCaseReducers<any>
> = {
    [K in keyof CaseReducerActions<CaseReducers, any>]: Event;
};

/**
 * Action Name and Type map
 */

export type ActionNameToTypeMap<
    CaseReducers extends SliceCaseReducers<any>,
    CRA extends CaseReducerActions<CaseReducers, any> = CaseReducerActions<
        CaseReducers,
        any
    >
> = {
    [K in keyof CRA]: CRA[K] extends ActionCreatorWithPayload<any, infer T>
        ? T
        : never;
};

/**
 * Do Undo Action Creators
 */
export const NO_OP_ACTION = createAction('NO_OP');

type NoOpActionType = typeof NO_OP_ACTION;

type DoUndoActionCreator<
    Payload,
    DoPayload = Payload,
    UndoPayload = DoPayload
> = (args: {
    action: PayloadAction<Payload>;
    currentState: any;
    previousState: any;
}) => {
    do?: NoOpActionType | PayloadAction<DoPayload>;
    undo: NoOpActionType | PayloadAction<UndoPayload>;
};

export type DoUndoActionCreators<CaseReducers extends SliceCaseReducers<any>> =
    Partial<{
        [key: string]: DoUndoActionCreator<any, any, any>;
        // [K in keyof CaseReducerActions<CaseReducers>]: CaseReducerActions<CaseReducers>[K] extends PayloadActionCreator<
        //   infer P
        // >
        //   ? DoUndoActionCreator<P, any, any>
        //   : never;
    }>;

export type GeneratedDoUndoActionCreators = {
    [key: string]: (
        args: Parameters<DoUndoActionCreator<any, any, any>>[0]
    ) => Required<ReturnType<DoUndoActionCreator<any, any, any>>>;
};

export const LABELS = Symbol('label');
export const DO_UNDO_ACTION_CREATORS = Symbol('do_undo_action_creators');
export const TRRACKABLE = Symbol('trrackable');
export const EVENTS = Symbol('events');
export const ACTION_NAME_TYPE_MAP = Symbol('action_name_type_map');
export const ASYNC_THUNKS = Symbol('async_thunks');

export type TrrackableSlice<
    State = any,
    CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
    Event extends string = string,
    Name extends string = string
> = Slice<State, CaseReducers, Name> & {
    [LABELS]: LabelGenerators;
    [EVENTS]: ReducerEventTypes<Event, CaseReducers>;
    [TRRACKABLE]: boolean;
    [DO_UNDO_ACTION_CREATORS]: GeneratedDoUndoActionCreators;
    [ACTION_NAME_TYPE_MAP]: ActionNameToTypeMap<CaseReducers>;
    [ASYNC_THUNKS]: Array<AsyncThunk<any, any, any>>;
};
