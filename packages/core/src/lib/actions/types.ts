import { BrandedId } from '../utils/branded_types';

// Base Types
export type ActionType = BrandedId<string, 'ActionId'>;

export type UndoActionType<T extends ActionType> = `undo/${T}`;

export type BaseAction<A extends ActionType = ActionType> = {
  type: A;
};

export type ActionWithPayload<
  P,
  A extends ActionType = ActionType
> = BaseAction<A> & {
  payload: P;
};

// Sideeffect Action Types
export type SideEffectAction<P, A extends ActionType = ActionType, P2 = P> = {
  do: ActionWithPayload<P, A>;
  undo: ActionWithPayload<P2, UndoActionType<A>>;
};

export type SideEffectFunction<P> = (payload: P) => void;

export type SideEffectActionCreator<
  P,
  A extends ActionType = ActionType,
  P2 = P
> = (doPayload: P, undoPayload?: P2) => SideEffectAction<P, A, P2>;

export type AddSideEffectActionOpts<
  P,
  A extends ActionType = ActionType,
  P2 = P
> = {
  doAction: A;
  doFn: SideEffectFunction<P>;
  undoFn?: SideEffectFunction<P2>;
};

// StateUpdate Action Types
export type StateUpdateAction<
  P,
  A extends ActionType = ActionType
> = ActionWithPayload<P, A>;

export type StateUpdateFunction<S, P> = (
  state: S,
  payload: P
) => void | Promise<void> | S | Promise<S>;

export type StateUpdateActionCreator<P, A extends ActionType = ActionType> = (
  p: P
) => StateUpdateAction<P, A>;

export type AddStateUpdateActionOpts<
  S,
  P,
  A extends ActionType = ActionType
> = {
  action: A;
  fn: StateUpdateFunction<S, P>;
};

// Combined Types
export type UpdateFunction<S, P> =
  | StateUpdateFunction<S, P>
  | SideEffectFunction<P>;

// Registry Types
export type ActionRegistry<S> = {
  list(): ActionType[];
  has(type: ActionType): boolean;
  addStateUpdateAction<P, A extends ActionType = ActionType>(
    opts: AddStateUpdateActionOpts<S, P, A>
  ): StateUpdateActionCreator<P, A>;
  addSideEffectAction<P, A extends ActionType = ActionType, P2 = P>(
    opts: AddSideEffectActionOpts<P, A, P2>
  ): SideEffectActionCreator<P, A, P2>;
};

// export type Action<A extends ActionType, P> = {
//   type: A;
//   payload: P;
// };
//
//
// export function getActionCreator<
//   Payload ,
//   ActionType extends string = string
// >(type: ActionType): ActionCreator<Payload, ActionType> {
//   return <P>(payload: P) => ({
//     type,
//     payload,
//   });
// }
//
//
// const registry = new Map<string, unknown>();
//
// function add<State, Arg, ActionType extends string>(
//   id: ActionType,
//   fn: (s: State, a: Arg) => void
// ) {
//   registry.set(id, fn);
//
//   return getActionCreator<Arg, ActionType>(id);
// }
//
// type State = {
//   todos: string[];
// };
//
// const addTodo = add('addTodo', (state: State, todo: string) => {
//   state.todos.push(todo);
// });
