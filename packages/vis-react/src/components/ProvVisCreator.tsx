import { initializeTrrack, NodeId } from '@trrack/core';
import ReactDOM from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { ProvVis, ProvVisConfig } from './ProvVis';

type TrrackLike = ReturnType<typeof initializeTrrack>;

export async function ProvVisCreator<TrrackInstance extends TrrackLike>(
    node: Element,
    trrackInstance: TrrackInstance,
    config: Partial<ProvVisConfig<unknown, string>> = {},
    REACT_16 = false
) {
    let root: Root | null = null;

    function renderTrrack() {
        const vis = (
            <ProvVis
                root={trrackInstance.root.id}
                config={{
                    changeCurrent: (id: NodeId) => trrackInstance.to(id),
                    ...config,
                }}
                nodeMap={trrackInstance.graph.backend.nodes}
                currentNode={trrackInstance.current.id}
            />
        );

        if (REACT_16) {
            ReactDOM.render(vis, node);
        } else {
            if (!root) {
                root = createRoot(node);
            }

            root.render(vis);
        }
    }

    trrackInstance.currentChange(() => {
        renderTrrack();
    });

    renderTrrack();
}
