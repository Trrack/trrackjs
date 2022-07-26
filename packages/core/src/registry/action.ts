import { PayloadAction } from '@reduxjs/toolkit';

export type TrrackActionMeta = {
    hasSideEffects: boolean;
};

/**
 * Action Tracking
 */
export type TrrackAction<T extends string = string, P = void> = PayloadAction<
    P,
    T,
    TrrackActionMeta
>;

export type TrrackActionFunction<
    DoActionPayload = any,
    UndoActionType extends string = string,
    UndoActionPayload = DoActionPayload
> = (args: DoActionPayload) => TrrackAction<UndoActionType, UndoActionPayload>;

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
