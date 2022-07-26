import { initializeTrrack, Registry } from '../src';

describe('test', () => {
    it('should work', () => {
        const registry = Registry.create();

        const addAction = registry.register({
            type: 'add',
            action: (args: { a: number; b: number }) => {
                console.log(args.a + args.b);
                return {
                    type: 'sub',
                    payload: args,
                    meta: {
                        hasSideEffects: true,
                    },
                };
            },
        });

        const subAction = registry.register({
            type: 'sub',
            action: (args: { a: number; b: number }) => {
                console.log(args.a - args.b);
                return {
                    type: 'add',
                    payload: args,
                    meta: {
                        hasSideEffects: true,
                    },
                };
            },
        });

        const initialState = {
            test: 'Hello, World 2!',
        };

        type State = typeof initialState;

        const changeHello = registry.registerState<State>({
            type: 'change-hello',
            action: (state, hello: string) => {
                state.test = hello;
            },
        });

        const trrack = initializeTrrack({
            initialState,
            registry,
        });

        console.log(trrack.state);

        trrack.apply('Add', addAction({ a: 1, b: 2 }));
        trrack.apply('Add', addAction({ a: 1, b: 2 }));

        const t = trrack.current.id;

        console.table(
            Object.values(trrack.graph.backend.nodes).map((d) => ({
                id: d.id,
                ...d.state,
                curr: trrack.current.id === d.id,
            }))
        );

        trrack.undo();
        trrack.undo();

        trrack.apply(
            'Say Hello',
            changeHello(Math.random().toFixed(5).toString())
        );
        trrack.apply(
            'Say Hello',
            changeHello(Math.random().toFixed(5).toString())
        );
        trrack.apply(
            'Say Hello',
            changeHello(Math.random().toFixed(5).toString())
        );

        console.table(
            Object.values(trrack.graph.backend.nodes).map((d) => ({
                id: d.id,
                ...d.state,
                curr: trrack.current.id === d.id,
            }))
        );

        trrack.to(t);

        console.table(
            Object.values(trrack.graph.backend.nodes).map((d) => ({
                id: d.id,
                ...d.state,
                curr: trrack.current.id === d.id,
            }))
        );
    });
});
