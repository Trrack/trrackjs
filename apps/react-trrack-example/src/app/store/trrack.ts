import { ActionRegistry, INode, RegistryEntry, Trrack } from '@trrack/core';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type GenericAction<T extends any[]> = (...args: T) => any;

type TrrackActionSetter = {
  action: GenericAction<any>;
  inverse: GenericAction<any>;
};

type ActionSetterMap = {
  [key: string]: TrrackActionSetter;
};

export function useTrrackSetup(initialActionSetters: ActionSetterMap = {}) {
  const [actionSetterMap, setActionSetterMap] = useState(initialActionSetters);
  const [current, setCurrent] = useState<INode | null>(null);

  const addAction = useCallback((name: string, action: TrrackActionSetter) => {
    setActionSetterMap((act) => {
      return { ...act, [name]: action };
    });
  }, []);

  const afr = useMemo(() => {
    const registry: { [k: string]: RegistryEntry } = {};

    Object.entries(actionSetterMap).forEach(([name, setter]) => {
      registry[name] = RegistryEntry.create(setter);
    });

    return ActionRegistry.create(registry);
  }, [actionSetterMap]);

  const trrack = useMemo(() => {
    const trrack = Trrack.initialize(afr);

    return trrack;
  }, [afr]);

  useEffect(() => {
    trrack.listenCurrentChanged(() => {
      setCurrent(trrack.current);
    });

    return () => trrack.clearListener();
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
