import {
  DEFAULT_TODO,
  Todo,
  addTodoAction,
  noopSideEffectAction,
  noopSideEffectActionWithPayload,
  noopStateUpdateTodoAction,
  noopStateUpdateTodoNoPayloadAction,
  noopStateUpdateTodoPayloadAction,
  setupTodoRegistry,
} from './todo/setup';

describe('createActionRegistry', () => {
  it('returns an ActionRegistry object', () => {
    const { registry } = setupTodoRegistry();

    expect(registry).toBeDefined();
    expect(registry).toHaveProperty('__record');
    expect(registry).toHaveProperty('list');
    expect(registry).toHaveProperty('has');
    expect(registry).toHaveProperty('registerStateUpdateAction');
    expect(registry).toHaveProperty('registerSideEffectAction');
    expect(registry).toHaveProperty('executeStateAction');
    expect(registry).toHaveProperty('executeSideEffectAction');
  });

  describe('State Update Actions', () => {
    it('registry.addStateUpdateAction adds an action to the registry', () => {
      const { registry } = setupTodoRegistry();

      registry.registerStateUpdateAction(
        noopStateUpdateTodoAction.id,
        noopStateUpdateTodoAction.fn
      );

      expect(registry.list()).toHaveLength(1);
      expect(registry.list()).toContain(noopStateUpdateTodoAction.id);
    });

    it('registry.addStateUpdateAction throws if action already exists', () => {
      const { registry } = setupTodoRegistry();

      registry.registerStateUpdateAction(
        noopStateUpdateTodoAction.id,
        noopStateUpdateTodoAction.fn
      );

      expect(() => {
        registry.registerStateUpdateAction(
          noopStateUpdateTodoAction.id,
          noopStateUpdateTodoAction.fn
        );
      }).toThrow();
    });

    it('registry.addStateUpdateAction returns a StateUpdateActionCreator', () => {
      const { registry } = setupTodoRegistry();

      const actionCreator = registry.registerStateUpdateAction<Todo>(
        noopStateUpdateTodoAction.id,
        noopStateUpdateTodoAction.fn
      );

      expect(actionCreator).toBeDefined();
      expect(actionCreator).toBeInstanceOf(Function);
    });

    it('registry.addStateUpdateAction can be used to create an action with a payload', () => {
      const { registry } = setupTodoRegistry();

      const actionCreator = registry.registerStateUpdateAction(
        noopStateUpdateTodoPayloadAction.id,
        noopStateUpdateTodoPayloadAction.fn
      );

      const action = actionCreator(DEFAULT_TODO);

      expect(action).toBeDefined();
      expect(action.type).toEqual(noopStateUpdateTodoPayloadAction.id);
      expect(action.payload).toEqual(DEFAULT_TODO);
    });

    it('registry.addStateUpdateAction can be used to create an action with no payload', () => {
      const { registry } = setupTodoRegistry();

      const actionCreator = registry.registerStateUpdateAction(
        noopStateUpdateTodoNoPayloadAction.id,
        noopStateUpdateTodoNoPayloadAction.fn
      );

      const action = actionCreator();

      expect(action).toBeDefined();
      expect(action.type).toEqual(noopStateUpdateTodoNoPayloadAction.id);
    });

    it('registry.execute executes a stateUpdateAction and returns new state', async () => {
      const { registry, initialState } = setupTodoRegistry();

      const todo: Todo = {
        id: 'new_todo',
        author: 'new_author',
        complete: false,
      };

      const addTodo = registry.registerStateUpdateAction(
        addTodoAction.id,
        addTodoAction.fn
      );

      const { newState } = await registry.executeStateAction(
        addTodo(todo),
        initialState
      );

      expect(newState.todos).toHaveLength(1);
      expect(newState.todos[0]).toEqual(todo);
    });
  });

  describe('Side Effect Actions', () => {
    it('registry.addSideEffectAction adds an action to the registry', () => {
      const { registry } = setupTodoRegistry();

      registry.registerSideEffectAction(
        noopSideEffectAction.id,
        noopSideEffectAction.fn
      );

      expect(registry.list()).toContain(noopSideEffectAction.id);
    });

    it('registry.addSideEffectAction adds an undo action to the registry', () => {
      const { registry } = setupTodoRegistry();

      registry.registerSideEffectAction(
        noopSideEffectAction.id,
        noopSideEffectAction.fn
      );

      expect(registry.list()).toContain(noopSideEffectAction.id);

      expect(registry.list()).toContain(`undo/${noopSideEffectAction.id}`);
    });

    it('registry.addSideEffectAction throws if action already exists', () => {
      const { registry } = setupTodoRegistry();

      registry.registerSideEffectAction(
        noopSideEffectAction.id,
        noopSideEffectAction.fn
      );

      expect(() => {
        registry.registerSideEffectAction(
          noopSideEffectAction.id,
          noopSideEffectAction.fn
        );
      }).toThrow();
    });

    it('registry.addSideEffectAction returns a SideEffectActionCreator', () => {
      const { registry } = setupTodoRegistry();

      const noop = registry.registerSideEffectAction(
        noopSideEffectAction.id,
        noopSideEffectAction.fn
      );

      expect(noop).toBeDefined();
      expect(noop).toBeInstanceOf(Function);
    });

    it('registry.addSideEffectAction return value can be used to create an action without payload', () => {
      const { registry } = setupTodoRegistry();

      const noop = registry.registerSideEffectAction(
        noopSideEffectAction.id,
        noopSideEffectAction.fn
      );

      const action = noop(null, null);

      expect(action.doAction.type).toEqual(noopSideEffectAction.id);
      expect(action.undoAction.type).toEqual(`undo/${noopSideEffectAction.id}`);
    });

    it('registry.addSideEffectAction return value can be used to create an action with payload', () => {
      const { registry } = setupTodoRegistry();

      const noop = registry.registerSideEffectAction(
        noopSideEffectActionWithPayload.id,
        noopSideEffectActionWithPayload.fn
      );

      const action = noop(3, 5);

      expect(action.doAction.type).toEqual(noopSideEffectAction.id);
      expect(action.doAction.payload).toEqual(3);
      expect(action.undoAction.type).toEqual(`undo/${noopSideEffectAction.id}`);
      expect(action.undoAction.payload).toEqual(5);
    });

    it('registry.executeSideEffectAction executes a sideEffectAction', async () => {
      const { registry } = setupTodoRegistry();

      const counter = {
        value: 0,
      };

      const addAction = registry.registerSideEffectAction(
        'add',
        (a: number) => {
          counter.value += a;
        },
        (a: number) => {
          counter.value -= a;
        }
      );

      const action = addAction(3, 3);

      expect(counter.value).toEqual(0);
      registry.executeSideEffectAction(action);
      expect(counter.value).toEqual(3);
      registry.executeSideEffectAction(action, true);
      expect(counter.value).toEqual(0);
    });

    //
  });

  //
});
