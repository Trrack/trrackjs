import { ActionRegistry } from '../src';

describe('Hello', () => {
    it('World', () => {
        const registry = ActionRegistry.init()
            .register('add', (a: number, b: number) => {
                console.log('Add', a, b, '=', a + b);
                return {
                    name: 'sub',
                    args: [a, b],
                };
            })
            .register('sub', (a: number, b: number) => {
                console.log('Sub', a, b, '=', a - b);
                return {
                    name: 'add',
                    args: [a, b],
                };
            });

        try {
            registry.apply({
                name: 'add',
                args: [1, 1],
            });
        } catch (e) {
            console.error(e);
            throw e;
        }

        expect(true).toBeTruthy();
    });
});
