import { describe, expect, it } from 'vitest';

import { createStateNode, NodeId } from '../src/graph/components';
import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';

function setup() {
    const registry = Registry.create();

    const add = registry.register('add', (state, amt) => {
        state.counter += amt;
    });

    const sub = registry.register('sub', (state, amt) => {
        state.counter -= amt;
    });

    const trrack = initializeTrrack({
        registry,
        initialState: {
            counter: 0,
        },
    });

    return { trrack, add, sub };
}

describe('Export', () => {
    it('export functions should return a stringified trrack graph and graph object', () => {
        const { trrack, add } = setup();

        expect(trrack.getState().counter).toEqual(0);

        trrack.apply('Add', add(2));
        expect(trrack.getState().counter).toEqual(2);

        const exportStr = trrack.export();
        expect(exportStr).toBeTypeOf('string');

        const parsed = JSON.parse(exportStr);
        expect(parsed).toHaveProperty('nodes');
        expect(parsed).toHaveProperty('current');
        expect(parsed).toHaveProperty('root');
    });

    it('import functions should load a stringified trrack graph and graph object', () => {
        const { trrack, add } = setup();

        expect(trrack.getState().counter).toEqual(0);

        trrack.apply('Add', add(2));
        expect(trrack.getState().counter).toEqual(2);

        const exportStr = trrack.export();
        const exportObject = trrack.exportObject();

        const { trrack: trrackStr } = setup();
        const { trrack: trrackObj } = setup();

        trrackStr.import(exportStr);
        trrackObj.importObject(exportObject);

        expect(trrackStr.getState().counter).toEqual(trrack.getState().counter);
        expect(trrackStr.root.id).toEqual(trrack.root.id);
        expect(trrackStr.current.id).toEqual(trrack.current.id);
        expect(Object.keys(trrackStr.graph.backend).length).toEqual(
            Object.keys(trrack.graph.backend).length
        );

        expect(trrackObj.getState().counter).toEqual(trrack.getState().counter);
        expect(trrackObj.root.id).toEqual(trrack.root.id);
        expect(trrackObj.current.id).toEqual(trrack.current.id);
        expect(Object.keys(trrackObj.graph.backend).length).toEqual(
            Object.keys(trrack.graph.backend).length
        );
    });

    it('loads malformed imported graphs with extra unreachable nodes but rejects traversal to them', async () => {
        const { trrack } = setup();
        const exportObject = trrack.exportObject();
        const orphan = createStateNode({
            event: 'add',
            label: 'Orphan',
            parent: exportObject.nodes[exportObject.root] as never,
            state: {
                type: 'checkpoint',
                val: {
                    counter: 99,
                },
            },
        });

        orphan.parent = 'missing-parent' as NodeId;
        exportObject.nodes[orphan.id] = orphan;

        const { trrack: imported } = setup();
        imported.importObject(exportObject);
        await Promise.resolve();

        expect(imported.root.id).toBe(exportObject.root);
        expect(imported.current.id).toBe(exportObject.root);
        await expect(imported.to(orphan.id)).rejects.toThrow();
    });

    it('freezes imported graph objects so later external mutation cannot rewrite the store', async () => {
        const { trrack, add } = setup();

        await trrack.apply('Add', add(2));

        const exportObject = trrack.exportObject();
        const rootNode = exportObject.nodes[exportObject.root] as {
            state: {
                type: 'checkpoint';
                val: {
                    counter: number;
                };
            };
        };
        const { trrack: imported } = setup();
        imported.importObject(exportObject);

        expect(Object.isFrozen(exportObject)).toBe(true);
        expect(Object.isFrozen(exportObject.nodes)).toBe(true);
        expect(Object.isFrozen(rootNode.state.val)).toBe(true);
        expect(imported.getState().counter).toBe(2);

        expect(() => {
            rootNode.state.val.counter = 99;
        }).toThrow(TypeError);

        expect(imported.getState().counter).toBe(2);
    });
});
