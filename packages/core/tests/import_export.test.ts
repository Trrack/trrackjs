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

    it('keeps graph.initialState isolated from later updates', async () => {
        const { trrack, add } = setup();
        const initialGraph = trrack.graph.initialState;
        const rootId = initialGraph.root;

        await trrack.apply('Add', add(1));
        trrack.metadata.add({ note: 'live backend only' });

        expect(initialGraph.current).toBe(rootId);
        expect(Object.keys(initialGraph.nodes)).toHaveLength(1);
        expect(initialGraph.nodes[rootId].children).toEqual([]);
        expect(initialGraph.nodes[rootId].meta.note).toBeUndefined();
    });

    it('does not mutate imported graph objects after importObject', async () => {
        const { trrack, add } = setup();

        await trrack.apply('Add', add(2));
        const snapshot = trrack.exportObject();

        const { trrack: imported } = setup();
        imported.importObject(snapshot);

        await imported.apply('Add', add(3));
        imported.metadata.add({ note: 'imported only' });

        expect(imported.graph.backend).not.toBe(snapshot);
        expect(snapshot.current).not.toBe(imported.current.id);
        expect(snapshot.nodes[snapshot.current].meta.note).toBeUndefined();
    });

    it('round-trips branched graphs with metadata, artifacts, annotations, and bookmarks', async () => {
        const { trrack, add, sub } = setup();

        trrack.metadata.add({ rootTag: 'origin' });
        trrack.artifact.add({ file: 'root.json' });

        await trrack.apply('Add', add(2));
        const firstBranchNode = trrack.current.id;
        trrack.metadata.add({ branch: 'first' });
        trrack.artifact.add({ file: 'first.json' });
        trrack.annotations.add('first branch');
        trrack.bookmarks.add();

        await trrack.undo();
        await trrack.apply('Sub', sub(1));
        const secondBranchNode = trrack.current.id;
        trrack.metadata.add({ branch: 'second' });
        trrack.artifact.add({ file: 'second.json' });
        trrack.annotations.add('second branch');

        const snapshot = trrack.exportObject();
        const exportStr = trrack.export();

        const { trrack: importedFromString } = setup();
        const { trrack: importedFromObject } = setup();

        importedFromString.import(exportStr);
        importedFromObject.importObject(JSON.parse(JSON.stringify(snapshot)));

        expect(importedFromString.exportObject()).toStrictEqual(snapshot);
        expect(importedFromObject.exportObject()).toStrictEqual(snapshot);
        expect(importedFromString.current.id).toBe(secondBranchNode);
        expect(importedFromString.root.id).toBe(snapshot.root);
        expect(
            importedFromString.graph.backend.nodes[firstBranchNode].meta['branch'][0]
                .val
        ).toBe('first');
        expect(
            importedFromString.graph.backend.nodes[firstBranchNode].artifacts[0]
                .val
        ).toEqual({ file: 'first.json' });
        expect(
            importedFromString.graph.backend.nodes[firstBranchNode].meta.annotation[0]
                .val
        ).toBe('first branch');
        expect(
            importedFromString.graph.backend.nodes[firstBranchNode].meta.bookmark[0]
                .val
        ).toBe(true);
        expect(
            importedFromString.graph.backend.nodes[secondBranchNode].meta['branch'][0]
                .val
        ).toBe('second');
        expect(importedFromString.getState()).toEqual({ counter: -1 });
    });
});
