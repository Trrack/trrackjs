import { initializeTrrack, Registry } from '@trrack/core';
import { useEffect, useMemo, useState } from 'react';

import styles from './App.module.css';
import { GraphRenderer, type GraphData } from './components/graphRender';
import { useElementSize } from './hooks/useElementSize';
import translate from './utils/translate';

type GraphState = {
  helloTo: string;
};

type GraphEvent = 'change-greeting';

const initialState: GraphState = {
  helloTo: 'World',
};

function randomGreeting() {
  const start = Math.floor(Math.random() * 10);
  const end = start + Math.max(2, Math.floor(Math.random() * 10));
  return 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    .replace(' ', 'asde')
    .slice(start, end);
}

function useGraph() {
    const { registry, actions } = useMemo(() => {
      const reg = Registry.create<GraphEvent>();
      const changeGreeting = reg.register<
        'change-greeting',
        never,
        string,
        never,
        GraphState
      >(
        'change-greeting',
        (state: GraphState, helloTo: string) => {
          state.helloTo = helloTo;
          return state;
        },
        { eventType: 'change-greeting', label: 'Change Greeting' }
      );

    return {
      registry: reg,
      actions: {
        changeGreeting,
      },
    };
  }, []);

  const trrack = useMemo(
    () =>
      initializeTrrack<GraphState, GraphEvent>({
        initialState,
        registry,
      }),
    [registry]
  );
  const [renderVersion, setRenderVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = trrack.currentChange(() => {
      setRenderVersion((version) => version + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [trrack]);

  const backend = trrack.graph.backend as GraphData;

  return {
    actions,
    backend,
    currentNodeId: trrack.current.id,
    state: trrack.getState(),
    trrack,
    renderVersion,
  };
}

export function App() {
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const { actions, backend, currentNodeId, state, trrack, renderVersion } =
    useGraph();

  return (
    <div ref={ref} className={styles['container']}>
      <section className={styles['controls']}>
        <div className={styles['controlCopy']}>
          <p className={styles['eyebrow']}>Graph playground</p>
          <h1>Greeting history</h1>
          <p>
            Trigger a few transitions and watch the provenance graph redraw as the
            current state changes.
          </p>
        </div>
        <div className={styles['buttonRow']}>
          <button
            type="button"
            className={styles['primaryButton']}
            onClick={() => {
              const nextGreeting = `Random ${Math.floor(Math.random() * 100)}`;
              trrack.apply(nextGreeting, actions.changeGreeting(nextGreeting));
            }}
          >
            Change Greeting
          </button>

          <button
            type="button"
            className={styles['secondaryButton']}
            onClick={() => {
              const nextGreeting = randomGreeting();
              trrack.apply(`Hello ${nextGreeting}`, actions.changeGreeting(nextGreeting));
            }}
          >
            Add Random State
          </button>
        </div>
      </section>
      <div className={styles['statusRow']}>
        <p className={styles['statusCard']}>
          Current greeting: <strong>{state.helloTo}</strong>
        </p>
        <p className={styles['statusCard']}>
          Render version: <strong>{renderVersion}</strong>
        </p>
      </div>
      <div className={styles['graphFrame']}>
        {backend && width > 0 && height > 0 ? (
          <svg key={currentNodeId} height={height} width={width}>
            <g transform={translate(100, height / 2)}>
              <GraphRenderer currentNodeId={currentNodeId} graph={backend} />
            </g>
          </svg>
        ) : null}
      </div>
    </div>
  );
}

export default App;
