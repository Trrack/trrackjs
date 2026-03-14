import { NodeId, Trrack } from '@trrack/core';
import { createRoot, Root } from 'react-dom/client';
import { ProvVis, ProvVisConfig } from './ProvVis';

export type ProvVisCleanup = () => boolean;

export async function ProvVisCreator<T, S extends string>(
    node: Element,
    trrackInstance: Trrack<T, S>,
    config: Partial<ProvVisConfig<T, S>> = {}
): Promise<ProvVisCleanup> {
    let root: Root | null = null;
    let cleanedUp = false;

    function renderTrrack() {
        if (cleanedUp) {
            return;
        }

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

    const unsubscribe = trrackInstance.currentChange(() => {
        renderTrrack();
    });

    renderTrrack();

    return () => {
        if (cleanedUp) {
            return false;
        }

        cleanedUp = true;
        const unsubscribed = unsubscribe();

        root?.unmount();
        root = null;

        return unsubscribed;
    };
}
