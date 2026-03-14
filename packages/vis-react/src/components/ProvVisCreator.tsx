import { NodeId, Trrack } from '@trrack/core';
import * as ReactDOM from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { ProvVis, ProvVisConfig } from './ProvVis';

type LegacyReactDOM = {
    render?: (children: unknown, container: Element) => void;
    unmountComponentAtNode: (container: Element | DocumentFragment) => boolean;
};

export type ProvVisCleanup = () => boolean;

export async function ProvVisCreator<T, S extends string>(
    node: Element,
    trrackInstance: Trrack<T, S>,
    config: Partial<ProvVisConfig<T, S>> = {},
    REACT_16 = false
): Promise<ProvVisCleanup> {
    let root: Root | null = null;
    let cleanedUp = false;
    const legacyReactDOM = ReactDOM as LegacyReactDOM;

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

        if (REACT_16 && legacyReactDOM.render) {
            legacyReactDOM.render(vis, node);
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
            legacyReactDOM.unmountComponentAtNode(node);
        } else {
            root?.unmount();
            root = null;
        }

        return unsubscribed;
    };
}
