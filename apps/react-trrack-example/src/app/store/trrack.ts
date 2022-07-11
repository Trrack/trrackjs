import { IProvenanceNode, LabelGenerator, Trrack, TrrackActionFunction } from '@trrack/core';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export function useTrrackSetup() {
  const [trrack, setTrrack] = useState<Trrack>(Trrack.init());

  const [current, setCurrent] = useState<IProvenanceNode>(trrack.current);

  const addAction = useCallback(
    (
      name: string,
      action: TrrackActionFunction,
      labelGenerator: LabelGenerator
    ) => {
      setTrrack((t) => {
        return t.has(name) ? t : t.register(name, action, labelGenerator);
      });
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

// Disabling because this is a valid use case
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const TrrackContext = createContext<TrrackContextType>(undefined!);

export function useTrrack() {
  return useContext(TrrackContext);
}
