import { Patch } from 'immer';
import { BrandedId } from '../utils/branded_types';

// ###################### Base Types ######################

/**
 * Represents a branded string type for action identifiers.
 */
export type AnyActionType = BrandedId<string, 'ActionId'>;

/**
 * Represents the type for an undo action, based on a given action type.
 * @template ActionType - The type of the original action to be undone.
 */
export type UndoActionType<ActionType extends AnyActionType> =
  `undo/${ActionType}`;

/**
 * Represents the base structure of an action.
 * @template ActionType - The type of the action.
 */
export type Action<ActionType extends AnyActionType> = {
  type: ActionType;
};

/**
 * Represents an action with an associated payload.
 * @template ActionType - The type of the action.
 * @template Payload - The type of the payload.
 */
export type ActionWithPayload<
  ActionType extends AnyActionType,
  Payload
> = Action<ActionType> & {
  payload: Payload;
};

// ###################### Side Effect Action Types ######################

/**
 * Represents an action that has side effects, composed of a 'do' action and an 'undo' action.
 * @template ActionType - The type of the action.
 * @template DoPayload - The type of the payload for the 'do' action.
 * @template UndoPayload - The type of the payload for the 'undo' action, defaults to P.
 */
export type SideEffectAction<
  ActionType extends AnyActionType,
  DoPayload,
  UndoPayload = DoPayload
> = {
  doAction: ActionWithPayload<ActionType, DoPayload>;
  undoAction: ActionWithPayload<UndoActionType<ActionType>, UndoPayload>;
};

/**
 * Type for a function that performs a side effect.
 * @template Payload - The type of the payload.
 */
export type SideEffectFunction<Payload> = (
  payload: Payload
) => void | Promise<void>;

/**
 * Type for a creator function that generates side effect actions.
 * @template ActionType - The type of the action.
 * @template DoPayload - The type of the payload for the 'do' action.
 * @template UndoPayload - The type of the payload for the 'undo' action, defaults to P.
 */
export type SideEffectActionCreator<
  ActionType extends AnyActionType,
  DoPayload,
  UndoPayload = DoPayload
> =
  | ((
      doPayload: DoPayload,
      undoPayload: UndoPayload
    ) => SideEffectAction<ActionType, DoPayload, UndoPayload>)
  | ((
      doPayload: DoPayload
    ) => SideEffectAction<ActionType, DoPayload, UndoPayload>)
  | (() => SideEffectAction<ActionType, DoPayload, UndoPayload>);

/**
 * Represents the result of executing a side effect action.
 * @template Result - The type of the result, defaults to void.
 */
export type SideEffectExecuteResult<Result = void> = {
  type: 'side_effect';
  result: Result;
};

// ###################### State-Update Action Types ######################

/**
 * Represents an action that updates the state.
 * @template ActionType - The type of the action.
 * @template Payload - The type of the payload, defaults to void.
 */
export type StateUpdateAction<
  ActionType extends AnyActionType,
  Payload = void
> = ActionWithPayload<ActionType, Payload>;

/**
 * Type for a function that updates the state.
 * @template State - The type of the state.
 * @template Payload - The type of the payload, defaults to void.
 */
export type StateUpdateFunction<State, Payload = void> = Payload extends void
  ? (state: State) => void | Promise<void> | State | Promise<State>
  : (
      state: State,
      payload: Payload
    ) => void | Promise<void> | State | Promise<State>;

/**
 * Type for a creator function that generates state update actions.
 * @template ActionType - The type of the action.
 * @template Payload - The type of the payload, defaults to void.
 */
export type StateUpdateActionCreator<
  ActionType extends AnyActionType,
  Payload = void
> = Payload extends void
  ? () => Action<ActionType>
  : (payload: Payload) => StateUpdateAction<ActionType, Payload>;

/**
 * Represents the result of executing a state update action.
 * @template State - The type of the new state.
 */
export type StateUpdateExecuteResult<State> = {
  type: 'state';
  newState: State;
  patches: Array<Patch>;
};

// ###################### Combined Types ######################

/**
 * Combined type for either state updates or side effects.
 * @template State - The type of the state.
 * @template Payload - The type of the payload.
 */
export type UpdateFunction<State, Payload> =
  | StateUpdateFunction<State, Payload>
  | SideEffectFunction<Payload>;

/**
 * Represents either a side effect action or a state update action.
 * @template ActionType - The type of the action.
 * @template Payload - The type of the payload for the action.
 * @template UndoPayload - The type of the payload for the undo action, defaults to P.
 */
export type AnyAction<
  ActionType extends AnyActionType,
  Payload,
  UndoPayload = Payload
> =
  | SideEffectAction<ActionType, Payload, UndoPayload>
  | StateUpdateAction<ActionType, Payload>;

export type ExecuteResult<StateOrResult> =
  | SideEffectExecuteResult<StateOrResult>
  | StateUpdateExecuteResult<StateOrResult>;

// ###################### Action Registry ######################

/**
 * Represents a registry for actions, allowing for the registration and execution of actions.
 * @template State - The type of the state.
 */
export type ActionRegistry<State> = {
  __record: Map<AnyActionType, UpdateFunction<State, unknown>>;
  /**
   * Lists all registered action types.
   * @returns An array of ActionType.
   */
  list(): AnyActionType[];
  /**
   * Checks if an action type is registered.
   * @param type - The ActionType to check.
   * @returns A boolean indicating whether the action type is registered.
   */
  has(type: AnyActionType): boolean;
  /**
   * Registers a state update action with the registry.
   * @template Payload - The type of the payload, defaults to void.
   * @template ActionType - The specific type of the action, defaults to ActionType.
   * @param action - The action type to register.
   * @param fn - The state update function associated with the action.
   * @returns A StateUpdateActionCreator function.
   */
  registerStateUpdateAction<
    Payload = void,
    ActionType extends AnyActionType = AnyActionType
  >(
    action: ActionType,
    fn: StateUpdateFunction<State, Payload>
  ): StateUpdateActionCreator<ActionType, Payload>;
  /**
   * Registers a side effect action with the registry.
   * @template ActionType - The specific type of the action.
   * @template DoPayload - The type of the payload for the 'do' action.
   * @template UndoPayload - The type of the payload for the 'undo' action, defaults to P.
   * @param action - The action type to register.
   * @param doFn - The function to execute the 'do' action.
   * @param undoFn - The function to execute the 'undo' action, defaults to doFn.
   * @returns A SideEffectActionCreator function.
   */
  registerSideEffectAction<
    ActionType extends AnyActionType,
    DoPayload,
    UndoPayload = DoPayload
  >(
    action: ActionType,
    doFn: SideEffectFunction<DoPayload>,
    undoFn?: SideEffectFunction<UndoPayload>
  ): SideEffectActionCreator<ActionType, DoPayload, UndoPayload>;
  /**
   * Executes a state update action and applies it to the given state.
   * @template ActionType - The specific type of the action.
   * @template Payload - The type of the payload.
   * @param createdAction - The state update action to execute.
   * @param state - The current state to be updated.
   * @returns A promise that resolves to the StateUpdateExecuteResult.
   */
  executeStateAction<ActionType extends AnyActionType, Payload>(
    createdAction: StateUpdateAction<ActionType, Payload>,
    state: State
  ): Promise<StateUpdateExecuteResult<State>>;
  /**
   * Executes a side effect action, defaults to executing the 'do' part, optionally can execute 'undo' part instead.
   * @template ActionType - The specific type of the action.
   * @template DoPayload - The type of the payload for the 'do' action.
   * @template UndoPayload - The type of the payload for the 'undo' action, defaults to P.
   * @template Result - The type of the result, defaults to void.
   * @param createdAction - The side effect action to execute.
   * @param undo - A boolean indicating whether to execute the 'undo' action.
   * @returns A promise that resolves to the SideEffectExecuteResult.
   */
  executeSideEffectAction<
    ActionType extends AnyActionType,
    DoPayload,
    UndoPayload = DoPayload,
    Result = void
  >(
    createdAction: SideEffectAction<ActionType, DoPayload, UndoPayload>,
    undo?: boolean
  ): Promise<SideEffectExecuteResult<Result>>;
};
