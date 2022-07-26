import { initializeTrrack, Registry } from '@trrack/core';
import { useMemo, useState } from 'react';

import { Task } from './types';

const initialState = {
  tasks: [] as Task[],
};

type State = typeof initialState;

export function useTrrackTaskManager() {
  const [counter, setCounter] = useState(0);
  const [state, setState] = useState(initialState);

  const { registry, actions } = useMemo(() => {
    const reg = Registry.create();

    const addTask = reg.registerState<State>({
      type: 'add-task',
      action: (state, task: Task) => {
        state.tasks.push(task);
      },
    });

    const removeTask = reg.registerState<State>({
      type: 'remove-task',
      action: (state, task: Task) => {
        state.tasks = state.tasks.filter((t) => t.id !== task.id);
      },
    });

    const markTaskComplete = reg.registerState<State>({
      type: 'complete-task',
      action: (state, task: Task) => {
        const idx = state.tasks.findIndex((d) => d.id === task.id);
        state.tasks[idx].completed = true;
      },
    });

    const markTaskIncomplete = reg.registerState<State>({
      type: 'incomplete-task',
      action: (state, task: Task) => {
        const idx = state.tasks.findIndex((d) => d.id === task.id);
        state.tasks[idx].completed = false;
      },
    });

    const incrementCounter = reg.register({
      type: 'increment-counter',
      action: (add: number) => {
        setCounter((c) => c + add);
        return {
          type: 'decrement-counter',
          payload: add,
          meta: {
            hasSideEffects: true,
          },
        };
      },
    });

    const decrementCounter = reg.register({
      type: 'decrement-counter',
      action: (sub: number) => {
        setCounter((c) => c - sub);
        return {
          type: 'increment-counter',
          payload: sub,
          meta: {
            hasSideEffects: true,
          },
        };
      },
    });

    return {
      registry: reg,
      actions: {
        addTask,
        removeTask,
        markTaskComplete,
        markTaskIncomplete,
        incrementCounter,
        decrementCounter,
      },
    };
  }, []);

  const trrack = useMemo(() => {
    const t = initializeTrrack({
      initialState,
      registry,
    });

    t.currentChange(() => {
      setState(t.current.state.val as State);
    });

    return t;
  }, [registry]);

  const current = useMemo(() => {
    return trrack.current;
  }, [trrack]);

  const isAtLatest = current ? current.children.length === 0 : false;

  const isAtRoot = current ? current.id === trrack.root.id : false;

  return {
    trrack,
    isAtLatest,
    isAtRoot,
    state,
    counter,
    actions,
  };
}

export type Trrack = ReturnType<typeof useTrrackTaskManager>;
