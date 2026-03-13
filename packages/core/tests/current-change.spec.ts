import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';

function setup() {
    const registry = Registry.create<'count'>();

    const add = registry.register(
        'add',
        (state, amt: number) => {
            state.counter += amt;
        },
        {
            eventType: 'count',
        }
    );

    const trrack = initializeTrrack({
        registry,
        initialState: {
            counter: 0,
        },
    });

    return { trrack, add };
}

describe('Current change listeners', () => {
    it('reports new nodes and traversals', async () => {
        const { trrack, add } = setup();
        const listener = vi.fn();

        trrack.currentChange(listener);

        await trrack.apply('Add', add(1));
        expect(listener).toHaveBeenNthCalledWith(1, 'new');

        await trrack.undo();
        expect(listener).toHaveBeenNthCalledWith(2, 'traversal');

        await trrack.redo();
        expect(listener).toHaveBeenNthCalledWith(3, 'traversal');
    });

    it('supports skipOnNew and unsubscribe', async () => {
        const { trrack, add } = setup();
        const listener = vi.fn();

        const unsubscribe = trrack.currentChange(listener, true);

        await trrack.apply('Add', add(1));
        expect(listener).not.toHaveBeenCalled();

        await trrack.undo();
        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith('traversal');

        expect(unsubscribe()).toBe(true);

        await trrack.redo();
        expect(listener).toHaveBeenCalledOnce();
        expect(unsubscribe()).toBe(false);
    });

    it('returns a new backend reference for each graph update', async () => {
        const { trrack, add } = setup();
        const initialBackend = trrack.graph.backend;

        await trrack.apply('Add', add(1));
        const afterApply = trrack.graph.backend;
        expect(afterApply).not.toBe(initialBackend);

        trrack.metadata.add({ note: 'backend changed' });
        const afterMetadata = trrack.graph.backend;
        expect(afterMetadata).not.toBe(afterApply);

        await trrack.undo();
        expect(trrack.graph.backend).not.toBe(afterMetadata);
    });
});
