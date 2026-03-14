import { Registry } from '../src/registry';

describe('Registry', () => {
    it('registers state actions and returns a matching action creator', () => {
        const registry = Registry.create<'count'>();

        const add = registry.register(
            'add',
            (state: { count: number }, amount: number) => {
                state.count += amount;
            }
        );

        const action = add(2);
        const registered = registry.get('add');

        expect(action).toEqual({
            type: 'add',
            payload: 2,
        });
        expect(add.type).toBe('add');
        expect(add.toString()).toBe('add');
        expect(add.match(action)).toBe(true);
        expect(add.match({ type: 'other' })).toBe(false);
        expect(registered.config.hasSideEffects).toBe(false);
        expect(registered.config.eventType).toBe('add');
        expect(registered.config.label(undefined)).toBe('add');
    });

    it('stores side effect action config and custom labels', () => {
        const registry = Registry.create<'network'>();

        const fetch = registry.register(
            'fetch',
            (id: number) => ({
                undo: {
                    type: 'fetch/undo',
                    payload: id,
                },
            }),
            {
                eventType: 'network',
                label: (id) => `Fetch ${id}`,
            }
        );

        const registered = registry.get('fetch');

        expect(fetch(4)).toEqual({
            type: 'fetch',
            payload: 4,
        });
        expect(registered.config.hasSideEffects).toBe(true);
        expect(registered.config.eventType).toBe('network');
        expect(registered.config.label(4)).toBe('Fetch 4');
    });

    it('rejects duplicate registrations', () => {
        const registry = Registry.create();

        registry.register('add', (state: { count: number }, amount: number) => {
            state.count += amount;
        });

        expect(() =>
            registry.register(
                'add',
                (state: { count: number }, amount: number) => {
                    state.count += amount;
                }
            )
        ).toThrow('Already registered: add');
    });

    it('rejects action functions with more than two arguments', () => {
        const registry = Registry.create();

        expect(() =>
            registry.register(
                'bad',
                ((a: number, b: number, c: number) => ({
                    undo: {
                        type: 'bad/undo',
                        payload: a + b + c,
                    },
                })) as never
            )
        ).toThrow('Incorrect action function signature');
    });

    it('throws when retrieving an unknown action', () => {
        const registry = Registry.create();

        expect(() => registry.get('missing')).toThrow('Not registered: missing');
    });
});
