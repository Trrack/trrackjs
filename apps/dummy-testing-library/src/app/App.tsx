import { Button } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { PayloadAction } from '@reduxjs/toolkit';
import { IProvenanceGraph, ProvenanceGraph, Trrack } from '@trrack/core';
import test from 'node:test';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './App.module.css';
import { GraphRenderer } from './components/graphRender';
import translate from './utils/translate';

function useGraph<T>(state: T) {
  const { reducer, actions } = Trrack.createState({
    initialState: 'Hello, World!',
    name: 'Test',
    reducers: {
      change(test, action: PayloadAction<string>) {
        return action.payload;
      },
    },
  });

  const t = Trrack.init({
    reducer: {
      test: reducer,
    },
  });
  t.apply('A', actions.change('Bye'));
  t.apply('2', actions.change('Bye eqr'));
  t.apply('3', actions.change('Bye asd'));
  t.apply('4', actions.change('Bye 1'));

  const [provenance, setProvenance] = useState<IProvenanceGraph<T> | null>(
    null
  );

  useEffect(() => {
    if (provenance) return;

    const prov = ProvenanceGraph.create<T>(state);

    prov.addAction('Hello', {
      do: {
        name: 'test',
        args: [1, 2],
      },
      undo: {
        name: 'test',
        args: [1, 2],
      },
    });

    setProvenance(prov);
  }, [provenance, state]);

  const backend = useMemo(() => {
    return provenance?.backend;
  }, [provenance?.backend]);

  return { graph: provenance, backend };
}

export function App() {
  const { ref, width, height } = useElementSize();
  const { graph, backend } = useGraph({ helloTo: 'World' });
  const [a, setA] = useState(Math.random());

  const key = useCallback(() => {
    if (!a) return '';
    return graph?.current.id || 'None';
  }, [graph, a]);

  return (
    <div ref={ref} className={styles['container']}>
      <div>
        <Button
          onClick={() => {
            setA(Math.random());
            graph?.addAction(`Random ${Math.floor(Math.random() * 100)}`, {
              do: {
                name: 'test',
                args: [1, 2],
              },
              undo: {
                name: 'test',
                args: [1, 2],
              },
            });
          }}
        >
          Add Random Action
        </Button>

        <Button
          onClick={() => {
            let [a, b] = [
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
            ];

            if (b < a) {
              const temp = a;
              a = b;
              b = temp;
            }
            if (a === b) {
              b += 2;
            }

            const t =
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo cum voluptatibus numquam inventore, rerum quo eaque iure aspernatur reiciendis. Minus repellat deserunt provident vel fugiat cum aliquid, aut optio commodi!'
                .replace(' ', 'asde')
                .slice(a, b);

            setA(Math.random());
            graph?.addState(`Hello ${t}`, {
              type: 'state',
              val: {
                helloTo: t,
              },
            });
          }}
        >
          Add Random State
        </Button>
      </div>
      {backend && (
        <svg key={key()} height={height} width={width}>
          <g transform={translate(100, height / 2)}>
            <GraphRenderer graph={backend} />
          </g>
        </svg>
      )}
    </div>
  );
}

export default App;
