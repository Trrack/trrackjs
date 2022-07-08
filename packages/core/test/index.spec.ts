import { Trrack } from '../src';

function print(trrack: Trrack) {
    const graph = trrack.graph;
    console.log({
        root: graph.root.id,
        current: graph.current.id,
        nodes: graph.getNodes(),
    });
}

describe('Hello', () => {
    it('World', () => {
        let trrack = Trrack.init();
        print(trrack);

        trrack = trrack
            .register('add', (a: number, b: number) => {
                console.log(a, '+', b, '=', a + b);
                return {
                    name: 'sub',
                    args: [a, b],
                };
            })
            .register('sub', (a: number, b: number) => {
                console.log(a, '-', b, '=', a - b);
                return {
                    name: 'add',
                    args: [a, b],
                };
            });

        trrack.apply({
            name: 'add',
            args: [1, 2],
            label: 'ADding 1 & 2',
        });
        print(trrack);

        trrack.undo();

        print(trrack);

        expect(true).toBeTruthy();
    });
});
