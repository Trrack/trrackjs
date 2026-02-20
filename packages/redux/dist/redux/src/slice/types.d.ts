import { ActionCreatorWithPayload, AsyncThunk, CaseReducerActions, PayloadAction, PayloadActionCreator, Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { Label, LabelGenerator } from '@trrack/core';
export type LabelLike<CaseReducers extends SliceCaseReducers<any>> = Partial<{
    [K in keyof CaseReducerActions<CaseReducers, any>]: CaseReducerActions<CaseReducers, any>[K] extends PayloadActionCreator<infer P> ? Label | LabelGenerator<P> : never;
}>;
export type LabelGenerators = {
    [key: string]: LabelGenerator<any>;
};
/**
 * Events
 */
export type ReducerEventTypes<Event extends string, CaseReducers extends SliceCaseReducers<any>> = {
    [K in keyof CaseReducerActions<CaseReducers, any>]: Event;
};
/**
 * Action Name and Type map
 */
export type ActionNameToTypeMap<CaseReducers extends SliceCaseReducers<any>, CRA extends CaseReducerActions<CaseReducers, any> = CaseReducerActions<CaseReducers, any>> = {
    [K in keyof CRA]: CRA[K] extends ActionCreatorWithPayload<any, infer T> ? T : never;
};
/**
 * Do Undo Action Creators
 */
export declare const NO_OP_ACTION: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"NO_OP">;
type NoOpActionType = typeof NO_OP_ACTION;
type DoUndoActionCreator<Payload, DoPayload = Payload, UndoPayload = DoPayload> = (args: {
    action: PayloadAction<Payload>;
    currentState: any;
    previousState: any;
}) => {
    do?: NoOpActionType | PayloadAction<DoPayload>;
    undo: NoOpActionType | PayloadAction<UndoPayload>;
};
export type DoUndoActionCreators<CaseReducers extends SliceCaseReducers<any>> = Partial<{
    [key: string]: DoUndoActionCreator<any, any, any>;
}>;
export type GeneratedDoUndoActionCreators = {
    [key: string]: (args: Parameters<DoUndoActionCreator<any, any, any>>[0]) => Required<ReturnType<DoUndoActionCreator<any, any, any>>>;
};
export declare const LABELS: unique symbol;
export declare const DO_UNDO_ACTION_CREATORS: unique symbol;
export declare const TRRACKABLE: unique symbol;
export declare const EVENTS: unique symbol;
export declare const ACTION_NAME_TYPE_MAP: unique symbol;
export declare const ASYNC_THUNKS: unique symbol;
export type TrrackableSlice<State, CaseReducers extends SliceCaseReducers<State>, Event extends string = string, Name extends string = string> = Slice<State, CaseReducers, Name> & {
    [LABELS]: LabelGenerators;
    [EVENTS]: ReducerEventTypes<Event, CaseReducers>;
    [TRRACKABLE]: boolean;
    [DO_UNDO_ACTION_CREATORS]: GeneratedDoUndoActionCreators;
    [ACTION_NAME_TYPE_MAP]: ActionNameToTypeMap<CaseReducers>;
    [ASYNC_THUNKS]: Array<AsyncThunk<any, any, any>>;
};
export {};
