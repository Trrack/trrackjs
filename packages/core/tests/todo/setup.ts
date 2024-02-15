import {
  ActionType,
  SideEffectAction,
  SideEffectFunction,
  StateUpdateFunction,
} from '../../src/lib/actions/types';
import { createActionRegistry } from '../../src/lib/actions/api';
import { Nullable } from 'vitest';

/**
 * Type definition for a unique identifier of a todo item.
 */
export type TodoId = string;

/**
 * Represents the structure of a todo item.
 */
export type Todo = {
  id: TodoId;
  author: string;
  complete: boolean;
};

/**
 * Represents the state structure in the application.
 */
export type State = {
  todos: Todo[];
  selectedTodoId: Nullable<TodoId>;
};

/**
 * Default todo item used as a fallback or initial value.
 */
export const DEFAULT_TODO: Todo = {
  id: 'default_id',
  author: 'default_author',
  complete: false,
};

/**
 * Sets up and returns a todo action registry.
 * @returns An object containing the registry.
 */
export function setupTodoRegistry() {
  const registry = createActionRegistry<State>();

  const initialState: State = {
    todos: [],
    selectedTodoId: null,
  };

  return {
    registry,
    initialState,
  };
}

/**
 * Generic type for an action object in the test suite.
 * @template S - The type of state.
 * @template P - The type of payload, defaulting to void.
 */
type TestStateActionObject<S, P = void> = {
  id: string;
  fn: StateUpdateFunction<S, P>;
};

/**
 * A no-operation action for state updates without any effect.
 */
export const noopStateUpdateTodoAction: TestStateActionObject<State> = {
  id: 'noop',
  fn: () => {},
};

/**
 * A no-operation action for state updates with a Todo payload, but without any effect.
 */
export const noopStateUpdateTodoPayloadAction: TestStateActionObject<
  State,
  Todo
> = {
  id: 'noop-payload',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fn: (_, __) => {},
};

/**
 * A no-operation action for state updates without payload and effect.
 */
export const noopStateUpdateTodoNoPayloadAction: TestStateActionObject<State> =
  {
    id: 'noop-payload',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fn: (_) => {},
  };

/**
 * An action for adding a todo item to the state.
 */
export const addTodoAction: TestStateActionObject<State, Todo> = {
  id: 'add-todo',
  fn: (state, todo) => {
    state.todos.push(todo);
  },
};

type TestSideEffectActionObject<A extends ActionType, P> = {
  id: A;
  fn: SideEffectFunction<P>;
};

export const noopSideEffectAction: TestSideEffectActionObject<'noop', unknown> =
  {
    id: 'noop',
    fn: () => {},
  };

export const noopSideEffectActionWithPayload: TestSideEffectActionObject<
  'noop',
  number
> = {
  id: 'noop',
  fn: (a) => {
    console.log(a);
  },
};
