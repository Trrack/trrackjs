import {
  AnyActionType,
  UpdateFunction,
  StateUpdateFunction,
  AnyAction,
  SideEffectFunction,
  SideEffectAction,
  StateUpdateAction,
  ExecuteResult,
} from './action.types';
import { sideEffectFunctionSymbol, stateUpdateFunctionSymbol } from './symbols';

export function isSideEffectAction<
  Payload,
  ActionType extends AnyActionType = AnyActionType,
  UndoPayload = Payload
>(
  action: AnyAction<ActionType, Payload, UndoPayload>
): action is SideEffectAction<ActionType, Payload, UndoPayload> {
  return 'do' in action;
}

export function isStateUpdateAction<
  Payload,
  ActionType extends AnyActionType = AnyActionType,
  UndoPayload = Payload
>(
  action: AnyAction<ActionType, Payload, UndoPayload>
): action is StateUpdateAction<ActionType, Payload> {
  return 'type' in action;
}

export function isStateUpdateFunction<State, Payload>(
  fn: UpdateFunction<State, Payload>
): fn is StateUpdateFunction<State, Payload> {
  return (
    (fn as unknown as { type: unknown }).type === stateUpdateFunctionSymbol
  );
}

export function isSideEffectFunction<State, Payload>(
  fn: UpdateFunction<State, Payload>
): fn is SideEffectFunction<Payload> {
  return (fn as unknown as { type: unknown }).type === sideEffectFunctionSymbol;
}

export function isExecuteResultVoid<Result>(
  result: ExecuteResult<Result>
): result is ExecuteResult<Result> {
  return result.type === 'side_effect';
}

export function isExecuteResultState<S>(
  result: ExecuteResult<unknown>
): result is ExecuteResult<S> {
  return result.type === 'state';
}
