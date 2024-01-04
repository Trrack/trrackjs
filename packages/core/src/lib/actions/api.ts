import { invariant } from '../utils/invariant';
import {
  ActionRegistry,
  ActionType,
  UpdateFunction,
  StateUpdateFunction,
  AddStateUpdateActionOpts,
  AddSideEffectActionOpts,
  StateUpdateActionCreator,
  SideEffectActionCreator,
  SideEffectFunction,
  UndoActionType,
} from './types';

export function getUndoActionType<A extends ActionType>(
  type: A
): UndoActionType<A> {
  return `undo/${type}`;
}

export function getStateActionCreator<
  Payload,
  ActionType extends string = string
>(type: ActionType): StateUpdateActionCreator<Payload, ActionType> {
  return <P>(payload: P) => ({
    type,
    payload,
  });
}

export function getSideEffectActionCreator<
  P,
  A extends ActionType = ActionType,
  P2 = P
>(doType: A, undoType: UndoActionType<A>): SideEffectActionCreator<P, A, P2> {
  return (doPayload: P, undoPayload?: P2) => ({
    do: {
      type: doType,
      payload: doPayload,
    },
    undo: {
      type: undoType,
      payload: undoPayload || (doPayload as unknown as P2),
    },
  });
}

export function createActionRegistry<S>(): ActionRegistry<S> {
  const __record: Map<ActionType, UpdateFunction<unknown, unknown>> = new Map();

  return {
    list(): string[] {
      return [...__record.keys()];
    },
    has(type: ActionType) {
      return __record.has(type);
    },
    addStateUpdateAction<P, A extends ActionType>({
      action,
      fn,
    }: AddStateUpdateActionOpts<S, P, A>) {
      invariant(__record.has(action), `${action} already exists`);

      __record.set(action, fn as StateUpdateFunction<unknown, unknown>);

      return getStateActionCreator<P, A>(action);
    },
    addSideEffectAction<P, A extends ActionType = ActionType, P2 = P>({
      doAction,
      doFn,
      undoFn,
    }: AddSideEffectActionOpts<P, A, P2>) {
      const undoAction = getUndoActionType(doAction);

      invariant(__record.has(doAction), `${doAction} already exists`);
      invariant(__record.has(undoAction), `${doAction} already exists`);

      __record.set(doAction, doFn as SideEffectFunction<unknown>);
      __record.set(undoAction, undoFn as SideEffectFunction<unknown>);

      return getSideEffectActionCreator<P, A, P2>(doAction, undoAction);
    },
  };
}
