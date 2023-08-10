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
});
