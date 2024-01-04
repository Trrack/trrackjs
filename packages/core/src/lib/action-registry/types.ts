import { Action } from '../graph/types';
import { ActionId } from '../ids/types';
import { LabelLike } from '../utils/types';

export type StateUpdateFunction<State> = (
  state: State,
  ...args: unknown[]
) => State | Promise<State>;

export type ActionFunction = (...args: unknown[]) => void;

type BaseFunctionOptions = {
  id: ActionId;
  event: string;
  defaultLabel: LabelLike;
};

export type AddActionFunctionOptions = BaseFunctionOptions & {
  type: 'action';
  fn: ActionFunction;
};

export type AddStateUpdateFunctionOptions<State> = BaseFunctionOptions & {
  type: 'state';
  fn: StateUpdateFunction<State>;
};

export type RegisterFunctionOptions<State> =
  | ActionFunction
  | StateUpdateFunction<State>;

export type ActionCreator = <
  DoArgs extends unknown[],
  UndoArgs extends unknown[]
>(opts: {
  doArgs: DoArgs;
  undoActionId: ActionId;
  undoArgs: UndoArgs;
}) => Action<DoArgs, UndoArgs>;

export type AddActionFunction = (
  opts: AddActionFunctionOptions
) => ActionCreator;

export type ActionRegistry = {
  listActions(): ActionId[];
  has(id: ActionId): boolean;
  addAction<State>(opts: RegisterFunctionOptions<State>): ActionRegistry;
  execute(id: ActionId, ...args: unknown[]): void;
};
