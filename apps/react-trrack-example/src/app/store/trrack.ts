import { IProvenanceNode, Trrack, TrrackActionFunction } from '@trrack/core';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export function useTrrackSetup() {
  const [trrack, setTrrack] = useState<Trrack>(Trrack.init());
  const [current, setCurrent] = useState<IProvenanceNode>(trrack.current);

  const addAction = useCallback(
    (name: string, action: TrrackActionFunction<any, any, any>) => {
      setTrrack((t) => t.register(name, action));
    },
    []
  );

  useEffect(() => {
    const sub = trrack.currentChangeListener(({ current }) => {
      setCurrent(current);
    });

    return () => sub.unsubscribe();
  }, [trrack]);

  const isAtLatest = current ? current.children.length === 0 : false;

  const isAtRoot = current ? current.id === trrack.root.id : false;

  return {
    addAction,
    trrack,
    isAtLatest,
    isAtRoot,
  };
}

export type TrrackContextType = ReturnType<typeof useTrrackSetup>;

export const TrrackContext = createContext<TrrackContextType>(undefined!);

export function useTrrack() {
  return useContext(TrrackContext);
}
