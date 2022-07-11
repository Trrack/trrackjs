import { GenericArgs } from '../../utils';

export type ApplyActionObject<
    TActionName extends string,
    Args extends GenericArgs
> = {
    name: TActionName;
    args: Args;
};

export type TrrackActionFunction<
    TDoArgs extends GenericArgs = any[],
    TUndoArgs extends GenericArgs = TDoArgs,
    TUndoActionName extends string = string
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
