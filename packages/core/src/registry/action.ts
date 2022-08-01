/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';

/**
 * Action Tracking
 */
export type TrrackAction<T extends string = string, P = void> = PayloadAction<
    P,
    T
>;

type TAF<
    DoActionPayload = any,
    UndoActionType extends string = string,
    UndoActionPayload = DoActionPayload
> = (args: DoActionPayload) => TrrackAction<UndoActionType, UndoActionPayload>;

type StateChangeFunction<State = any, Payload = any> = (
    state: State,
    payload: Payload
) => void;

export type TrrackActionFunction<
    DoActionPayload = any,
    UndoActionType extends string = string,
    UndoActionPayload = DoActionPayload
> =
    | TAF<DoActionPayload, UndoActionType, UndoActionPayload>
    | StateChangeFunction;

export type LabelGenerator<Args> = (args: Args) => string;

export type TrrackActionConfig<Args, Event> = {
    hasSideEffects: boolean;
    eventType: Event;
    label: LabelGenerator<Args>;
};

export type TrrackActionFunctionObject<
    Event extends string = string,
    DoActionPayload = any
> = {
    func: any;
    config: TrrackActionConfig<DoActionPayload, Event>;
};

export type TrrackActionRecord<
    DoActionType extends string,
    DoActionPayload,
    UndoActionType extends string,
    UndoActionPayload
> = {
    do: TrrackAction<DoActionType, DoActionPayload>;
    undo: TrrackAction<UndoActionType, UndoActionPayload>;
};

// /**
//  * State tracking
//  */
// export type TrrackStateUpdateType = 'Regular' | 'Ephemeral';
// export type TrrackStateSaveMode = 'Auto' | 'Complete' | 'Patch';
