import { describe, expect, it, vi } from 'vitest';

import { createStateNode } from '../src/graph/components';
import { initializeProvenanceGraph } from '../src/graph/provenance-graph';

describe('initializeProvenanceGraph', () => {
    it('notifies listeners for addNode and changeCurrent, respecting skipOnNew', () => {
        const graph = initializeProvenanceGraph<{ count: number }, 'increment'>({
            count: 0,
        });
        const allListener = vi.fn();
        const traversalListener = vi.fn();

        graph.currentChange(allListener, {
            skipOnNew: false,
        });
        graph.currentChange(traversalListener, {
            skipOnNew: true,
        });

        const node = createStateNode({
            event: 'increment',
            label: 'Increment',
            parent: graph.current,
            state: {
                type: 'checkpoint',
                val: { count: 1 },
            },
        });

        graph.update(graph.addNode(node));
        graph.update(graph.changeCurrent(graph.root.id));

        expect(allListener).toHaveBeenNthCalledWith(1, 'new');
        expect(allListener).toHaveBeenNthCalledWith(2, 'traversal');
        expect(traversalListener).toHaveBeenCalledTimes(1);
        expect(traversalListener).toHaveBeenCalledWith('traversal');
    });

    it('supports repeated unsubscribe calls and keeps backend/current/root in sync', () => {
        const graph = initializeProvenanceGraph<{ count: number }, 'increment'>({
            count: 0,
        });
        const listener = vi.fn();
        const unsubscribe = graph.currentChange(listener, {
            skipOnNew: false,
        });

        const node = createStateNode({
            event: 'increment',
            label: 'Increment',
            parent: graph.current,
            state: {
                type: 'checkpoint',
                val: { count: 1 },
            },
        });

        graph.update(graph.addNode(node));

        expect(graph.backend.current).toBe(node.id);
        expect(graph.current.id).toBe(node.id);
        expect(graph.root.id).toBe(graph.backend.root);
        expect(unsubscribe()).toBe(true);
        expect(unsubscribe()).toBe(false);

        graph.update(graph.changeCurrent(graph.root.id));
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
