import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';

describe('State recording', () => {
    it('stores small changes as patches and larger changes as checkpoints', async () => {
        const registry = Registry.create<'shape'>();

        const setA = registry.register(
            'setA',
            (
                state: { a: number; b: number; c: number; d: number },
                value: number
            ) => {
                state.a = value;
            },
            {
                eventType: 'shape',
            }
        );

        const replaceMany = registry.register(
            'replaceMany',
            (
                state: { a: number; b: number; c: number; d: number },
                value: number
            ) => {
                state.a = value;
                state.b = value + 1;
                state.c = value + 2;
            },
            {
                eventType: 'shape',
            }
        );

        const trrack = initializeTrrack({
            registry,
            initialState: {
                a: 0,
                b: 0,
                c: 0,
                d: 0,
            },
        });

        await trrack.apply('Set A', setA(9));
        expect(trrack.current.state.type).toBe('patch');

        await trrack.apply('Replace Many', replaceMany(5));
        expect(trrack.current.state.type).toBe('checkpoint');
        expect(trrack.getState()).toEqual({
            a: 5,
            b: 6,
            c: 7,
            d: 0,
        });
    });
});
