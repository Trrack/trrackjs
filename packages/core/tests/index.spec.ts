import { ProvenanceGraph } from '../src';

describe('test', () => {
    it('should work', () => {
        const t = new ProvenanceGraph();
        t.addAction('Hello', {
            do: {
                name: 'test',
                args: [1, 2],
            },
            undo: {
                name: 'test',
                args: [1, 2],
            },
        });
        console.log(t);
    });
});
