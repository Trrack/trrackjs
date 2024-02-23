import { castImmutable, enablePatches, produceWithPatches } from 'immer';
import { invariant } from '../utils/invariant';
import {
  ActionRegistry,
  AnyActionType,
  UpdateFunction,
  SideEffectFunction,
  StateUpdateFunction,
  StateUpdateActionCreator,
  StateUpdateAction,
  SideEffectAction,
  SideEffectActionCreator,
  UndoActionType,
} from './action.types';
import { sideEffectFunctionSymbol, stateUpdateFunctionSymbol } from './symbols';
import { isSideEffectFunction } from './guards';

enablePatches();

export function getUndoActionType<A extends AnyActionType>(
  type: A
): UndoActionType<A> {
  return `undo/${type}`;
}

export function getStateActionCreator<A extends AnyActionType>(
  type: A
): StateUpdateActionCreator<A, void>;
export function getStateActionCreator<A extends AnyActionType, P>(
  type: A
): StateUpdateActionCreator<A, P>;
export function getStateActionCreator<A extends AnyActionType, P = void>(
  type: A
) {
  return (payload?: P) => ({
    type,
    payload: payload as P,
  });
}

export function getSideEffectActionCreator<A extends AnyActionType, P, P2 = P>(
  doType: A,
  undoType: UndoActionType<A>
): SideEffectActionCreator<A, P, P2> {
  return (doPayload: P, undoPayload: P2) => ({
    doAction: {
      type: doType,
      payload: doPayload,
    },
    undoAction: {
      type: undoType,
      payload: undoPayload || (doPayload as unknown as P2),
    },
  });
}

export function createActionRegistry<S>(): ActionRegistry<S> {
  const __record: Map<AnyActionType, UpdateFunction<S, unknown>> = new Map();

  return {
    __record,
    list(): string[] {
      return [...__record.keys()];
    },
    has(type: AnyActionType) {
      return __record.has(type);
    },
    registerStateUpdateAction<P, A extends AnyActionType = AnyActionType>(
      action: A,
      fn: StateUpdateFunction<S, P>
    ) {
      invariant(!__record.has(action), `${action} already exists`);

      (fn as unknown as { type: typeof stateUpdateFunctionSymbol }).type =
        stateUpdateFunctionSymbol;

      __record.set(action, fn as StateUpdateFunction<S, unknown>);

      return getStateActionCreator<A, P>(action);
    },
    registerSideEffectAction<A extends AnyActionType, P, P2 = P>(
      action: A,
      doFn: SideEffectFunction<P>,
      undoFn?: SideEffectFunction<P2>
    ) {
      const undoAction = getUndoActionType(action);

      invariant(!__record.has(action), `${action} already exists`);
      invariant(!__record.has(undoAction), `${action} already exists`);

      (doFn as unknown as { type: typeof sideEffectFunctionSymbol }).type =
        sideEffectFunctionSymbol;
      if (undoFn)
        (undoFn as unknown as { type: typeof sideEffectFunctionSymbol }).type =
          sideEffectFunctionSymbol;

      __record.set(action, doFn as SideEffectFunction<unknown>);
      __record.set(undoAction, undoFn as SideEffectFunction<unknown>);

      return getSideEffectActionCreator<A, P, P2>(action, undoAction);
    },
    async executeStateAction<A extends AnyActionType, P>(
      action: StateUpdateAction<A, P>,
      state: S
    ) {
      const { type, payload } = action;

      const fn = __record.get(type);

      invariant(!!fn, `${type} does not registered.`);

      const applyFn = produceWithPatches(
        fn as StateUpdateFunction<S, typeof payload>
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [result, patches, __] = applyFn(castImmutable(state), payload);

      return {
        type: 'state',
        newState: result,
        patches,
      };
    },
    async executeSideEffectAction<A extends AnyActionType, P, P2 = P, R = void>(
      createdAction: SideEffectAction<A, P, P2>,
      undo = false
    ) {
      const action = undo ? createdAction.undoAction : createdAction.doAction;

      const { type, payload } = action;

      const fn = __record.get(type);

      invariant(!!fn, `${type} does not registered.`);
      invariant(isSideEffectFunction(fn), `${type} is not a side effect`);

      const result = (await fn(payload)) as R;

      return { type: 'side_effect', result };
    },
  };
}
