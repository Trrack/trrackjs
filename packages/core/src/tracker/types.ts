import { GenericArgs } from '../action';

export type ApplyActionParams<
    T,
    Args extends GenericArgs,
    UndoArgs extends GenericArgs
> = {
    action: T;
    label: string;
    args: Args;
    undoArgs?: UndoArgs;
};
