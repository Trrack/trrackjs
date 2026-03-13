import { NodeId, Trrack } from '@trrack/core';
import { createRoot, Root } from 'react-dom/client';
import { ProvVis, ProvVisConfig } from './ProvVis';

export async function ProvVisCreator<T, S extends string>(
    node: Element,
    trrackInstance: Trrack<T, S>,
    config: Partial<ProvVisConfig<T, S>> = {}
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

        if (!root) {
            root = createRoot(node);
        }

        root.render(vis);
    }

    trrackInstance.currentChange(() => {
        renderTrrack();
    });

    renderTrrack();
}
