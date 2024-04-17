import { initializeTrrack, Registry } from '@trrack/core';
import { useMemo, useState } from 'react';

import { Task } from './types';

const initialState = {
  tasks: [] as Task[],
};

type State = typeof initialState;

// ! Add example for async action (e.g. data loading)
export function useTrrackTaskManager() {
  const [counter, setCounter] = useState(0);
  const [state, setState] = useState(initialState);

  const { registry, actions } = useMemo(() => {
    const reg = Registry.create();

    const addTask = reg.register('add-task', (state, task: Task) => {
      state.tasks.push(task);
    });

    const removeTask = reg.register('remove-task', (state, task: Task) => {
      state.tasks = state.tasks.filter((t: Task) => t.id !== task.id);
    });

    const markTaskComplete = reg.register(
      'complete-task',
      (state, task: Task) => {
        const idx = state.tasks.findIndex((d: any) => d.id === task.id);
        state.tasks[idx].completed = true;
      }
    );

    const markTaskIncomplete = reg.register(
      'incomplete-task',
      (state, task: Task) => {
        const idx = state.tasks.findIndex((d: any) => d.id === task.id);
        state.tasks[idx].completed = false;
      }
    );

    const incrementCounter = reg.register(
      'increment-counter',
      (add: number) => {
        setCounter((c) => c + add);
        return {
          undo: {
          type: 'decrement-counter',
          payload: add,
          meta: {
            hasSideEffects: true,
          },
        }
        };
      }
    );

    const decrementCounter = reg.register(
      'decrement-counter',
      (sub: number) => {
        setCounter((c) => c - sub);
        return {
          undo: {
          type: 'increment-counter',
          payload: sub,
          meta: {
            hasSideEffects: true,
          },
        }
        };
      }
    );

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
