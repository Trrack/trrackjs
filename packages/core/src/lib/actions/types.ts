import { Patch } from 'immer';
import { BrandedId } from '../utils/branded_types';

// ###################### Base Types ######################

/**
 * Represents a branded string type for action identifiers.
 */
export type ActionType = BrandedId<string, 'ActionId'>;

/**
 * Represents the type for an undo action, based on a given action type.
 * @template A - The type of the original action to be undone.
 */
export type UndoActionType<A extends ActionType> = `undo/${A}`;

/**
 * Represents the base structure of an action.
 * @template A - The type of the action.
 */
export type Action<A extends ActionType> = {
  type: A;
};

/**
 * Represents an action with an associated payload.
 * @template A - The type of the action.
 * @template P - The type of the payload.
 */
export type ActionWithPayload<A extends ActionType, P> = Action<A> & {
  payload: P;
};

// ###################### Side Effect Action Types ######################

/**
 * Represents an action that has side effects, composed of a 'do' action and an 'undo' action.
 * @template A - The type of the action.
 * @template P - The type of the payload for the 'do' action.
 * @template P2 - The type of the payload for the 'undo' action, defaults to P.
 */
export type SideEffectAction<A extends ActionType, P, P2 = P> = {
  doAction: ActionWithPayload<A, P>;
  undoAction: ActionWithPayload<UndoActionType<A>, P2>;
};

/**
 * Type for a function that performs a side effect.
 * @template P - The type of the payload.
 */
export type SideEffectFunction<P> = (payload: P) => void | Promise<void>;

/**
 * Type for a creator function that generates side effect actions.
 * @template A - The type of the action.
 * @template P - The type of the payload for the 'do' action.
 * @template P2 - The type of the payload for the 'undo' action, defaults to P.
 */
export type SideEffectActionCreator<A extends ActionType, P, P2 = P> =
  | ((doPayload: P, undoPayload: P2) => SideEffectAction<A, P, P2>)
  | ((doPayload: P) => SideEffectAction<A, P, P2>)
  | (() => SideEffectAction<A, P, P2>);

/**
 * Represents the result of executing a side effect action.
 * @template R - The type of the result, defaults to void.
 */
export type SideEffectExecuteResult<R = void> = {
  type: 'side_effect';
  result: R;
};

// ###################### State-Update Action Types ######################

/**
 * Represents an action that updates the state.
 * @template A - The type of the action.
 * @template P - The type of the payload, defaults to void.
 */
export type StateUpdateAction<
  A extends ActionType,
  P = void
> = ActionWithPayload<A, P>;

/**
 * Type for a function that updates the state.
 * @template S - The type of the state.
 * @template P - The type of the payload, defaults to void.
 */
export type StateUpdateFunction<S, P = void> = P extends void
  ? (state: S) => void | Promise<void> | S | Promise<S>
  : (state: S, payload: P) => void | Promise<void> | S | Promise<S>;

/**
 * Type for a creator function that generates state update actions.
 * @template A - The type of the action.
 * @template P - The type of the payload, defaults to void.
 */
export type StateUpdateActionCreator<
  A extends ActionType,
  P = void
> = P extends void ? () => Action<A> : (payload: P) => StateUpdateAction<A, P>;

/**
 * Represents the result of executing a state update action.
 * @template S - The type of the new state.
 */
export type StateUpdateExecuteResult<S> = {
  type: 'state';
  newState: S;
  patches: Array<Patch>;
};

// ###################### Combined Types ######################

/**
 * Combined type for either state updates or side effects.
 * @template S - The type of the state.
 * @template P - The type of the payload.
 */
export type UpdateFunction<S, P> =
  | StateUpdateFunction<S, P>
  | SideEffectFunction<P>;

/**
 * Represents either a side effect action or a state update action.
 * @template A - The type of the action.
 * @template P - The type of the payload for the action.
 * @template P2 - The type of the payload for the undo action, defaults to P.
 */
export type AnyAction<A extends ActionType, P, P2 = P> =
  | SideEffectAction<A, P, P2>
  | StateUpdateAction<A, P>;

// ###################### Action Registry ######################

/**
 * Represents a registry for actions, allowing for the registration and execution of actions.
 * @template S - The type of the state.
 */
export type ActionRegistry<S> = {
  __record: Map<ActionType, UpdateFunction<S, unknown>>;
  /**
   * Lists all registered action types.
   * @returns An array of ActionType.
   */
  list(): ActionType[];
  /**
   * Checks if an action type is registered.
   * @param type - The ActionType to check.
   * @returns A boolean indicating whether the action type is registered.
   */
  has(type: ActionType): boolean;
  /**
   * Registers a state update action with the registry.
   * @template P - The type of the payload, defaults to void.
   * @template A - The specific type of the action, defaults to ActionType.
   * @param action - The action type to register.
   * @param fn - The state update function associated with the action.
   * @returns A StateUpdateActionCreator function.
   */
  registerStateUpdateAction<P = void, A extends ActionType = ActionType>(
    action: A,
    fn: StateUpdateFunction<S, P>
  ): StateUpdateActionCreator<A, P>;
  /**
   * Registers a side effect action with the registry.
   * @template A - The specific type of the action.
   * @template P - The type of the payload for the 'do' action.
   * @template P2 - The type of the payload for the 'undo' action, defaults to P.
   * @param action - The action type to register.
   * @param doFn - The function to execute the 'do' action.
   * @param undoFn - The function to execute the 'undo' action, defaults to doFn.
   * @returns A SideEffectActionCreator function.
   */
  registerSideEffectAction<A extends ActionType, P, P2 = P>(
    action: A,
    doFn: SideEffectFunction<P>,
    undoFn?: SideEffectFunction<P2>
  ): SideEffectActionCreator<A, P, P2>;
  /**
   * Executes a state update action and applies it to the given state.
   * @template A - The specific type of the action.
   * @template P - The type of the payload.
   * @param createdAction - The state update action to execute.
   * @param state - The current state to be updated.
   * @returns A promise that resolves to the StateUpdateExecuteResult.
   */
  executeStateAction<A extends ActionType, P>(
    createdAction: StateUpdateAction<A, P>,
    state: S
  ): Promise<StateUpdateExecuteResult<S>>;
  /**
   * Executes a side effect action, defaults to executing the 'do' part, optionally can execute 'undo' part instead.
   * @template A - The specific type of the action.
   * @template P - The type of the payload for the 'do' action.
   * @template P2 - The type of the payload for the 'undo' action, defaults to P.
   * @template R - The type of the result, defaults to void.
   * @param createdAction - The side effect action to execute.
   * @param undo - A boolean indicating whether to execute the 'undo' action.
   * @returns A promise that resolves to the SideEffectExecuteResult.
   */
  executeSideEffectAction<A extends ActionType, P, P2 = P, R = void>(
    createdAction: SideEffectAction<A, P, P2>,
    undo?: boolean
  ): Promise<SideEffectExecuteResult<R>>;
};
