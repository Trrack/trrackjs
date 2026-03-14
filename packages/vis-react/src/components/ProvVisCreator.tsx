import {
    initializeTrrack,
    NodeId,
    UnsubscribeCurrentChangeListener,
} from '@trrack/core';
import ReactDOM from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { ProvVis, ProvVisConfig } from './ProvVis';

type TrrackLike = ReturnType<typeof initializeTrrack>;
export type ProvVisCleanup = UnsubscribeCurrentChangeListener;

export async function ProvVisCreator<TrrackInstance extends TrrackLike>(
    node: Element,
    trrackInstance: TrrackInstance,
    config: Partial<ProvVisConfig<unknown, string>> = {},
    REACT_16 = false
): Promise<ProvVisCleanup> {
    let root: Root | null = null;
    let cleanedUp = false;

    function renderTrrack() {
        if (cleanedUp) return;

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

        if (REACT_16) {
            ReactDOM.unmountComponentAtNode(node);
        } else {
            root?.unmount();
            root = null;
        }

        return unsubscribed;
    };
}
