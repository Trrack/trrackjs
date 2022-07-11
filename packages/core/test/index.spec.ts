import { ProvenanceGraph } from '../src';

describe('Hello', () => {
    it('World', () => {
        const graph = ProvenanceGraph.init();

        (graph.current as any).troll = false;

        graph.addNode({
            type: 'Action',
        });

        console.log(
            JSON.stringify(
                graph,
                (key, value) => {
                    if (key === 'backend') {
                        const edges: any[] = [];

                        value.forEachLink((l) => edges.push(l));

                        return { edges };
                    }
                    if (key.startsWith('_')) return null;
                    return value;
                },
                4
            )
        );

        expect(true).toBeTruthy();
    });
});
