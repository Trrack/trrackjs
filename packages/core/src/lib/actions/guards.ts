import {
  ActionType,
  UpdateFunction,
  StateUpdateFunction,
  AnyAction,
  SideEffectFunction,
  SideEffectAction,
  StateUpdateAction,
  ExecuteResult,
} from './types';
import { sideEffectFunctionSymbol, stateUpdateFunctionSymbol } from './symbols';

export function isSideEffectAction<
  P,
  A extends ActionType = ActionType,
  P2 = P
>(action: AnyAction<P, A, P2>): action is SideEffectAction<P, A, P2> {
  return 'do' in action;
}

export function isStateUpdateAction<
  P,
  A extends ActionType = ActionType,
  P2 = P
>(action: AnyAction<P, A, P2>): action is StateUpdateAction<P, A> {
  return 'type' in action;
}

export function isStateUpdateFunction<S, P>(
  fn: UpdateFunction<S, P>
): fn is StateUpdateFunction<S, P> {
  return (
    (fn as unknown as { type: unknown }).type === stateUpdateFunctionSymbol
  );
}

export function isSideEffectFunction<S, P>(
  fn: UpdateFunction<S, P>
): fn is SideEffectFunction<P> {
  return (fn as unknown as { type: unknown }).type === sideEffectFunctionSymbol;
}

export function isExecuteResultVoid(
  result: ExecuteResult<unknown>
): result is ExecuteResult<void> {
  return result.type === 'void';
}

export function isExecuteResultState<S>(
  result: ExecuteResult<unknown>
): result is ExecuteResult<S> {
  return result.type === 'state';
}
