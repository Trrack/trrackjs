import { GenericArgs } from '../../utils';

/**
 * Action Tracking
 */
export type ApplyActionObject<
    TActionName extends string = string,
    Args extends GenericArgs = GenericArgs
> = {
    name: TActionName;
    args: Args;
};

export type TrrackActionFunction<
    TDoArgs extends GenericArgs = GenericArgs,
    TUndoActionName extends string = string,
    TUndoArgs extends GenericArgs = TDoArgs
> = (...args: TDoArgs) => ApplyActionObject<TUndoActionName, TUndoArgs>;

export type TrrackAction<
    TDoActionName extends string = string,
    TDoArgs extends GenericArgs = GenericArgs,
    TUndoActionName extends string = TDoActionName,
    TUndoArgs extends GenericArgs = TDoArgs
> = {
    do: ApplyActionObject<TDoActionName, TDoArgs>;
    undo: ApplyActionObject<TUndoActionName, TUndoArgs>;
};

/**
 * State tracking
 */
export type TrrackStateUpdateType = 'Regular' | 'Ephemeral';
export type TrrackStateSaveMode = 'Auto' | 'Complete' | 'Patch';
