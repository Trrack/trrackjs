import { describe, expect, expectTypeOf, it } from 'vitest';

import { createAction } from './action';

describe('createAction', () => {
    it('supports prepared action creators with multiple args and meta/error', () => {
        const setRange = createAction(
            'set-range',
            (start: number, end: number) => ({
                payload: { start, end },
                meta: { source: 'slider' as const },
                error: false as const,
            })
        );

        const action = setRange(1, 3);

        expectTypeOf(action.payload).toEqualTypeOf<{
            start: number;
            end: number;
        }>();
        expectTypeOf(action.meta).toEqualTypeOf<{
            source: 'slider';
        }>();
        expectTypeOf(action.error).toEqualTypeOf<false>();
        expect(action).toEqual({
            payload: { start: 1, end: 3 },
            meta: { source: 'slider' },
            error: false,
            type: 'set-range',
        });
    });

    it('returns false from match for nullish and non-matching inputs', () => {
        const mark = createAction<string>('mark');

        expect(mark.match(null)).toBe(false);
        expect(mark.match(undefined)).toBe(false);
        expect(mark.match({ type: 'other' })).toBe(false);
        expect(mark.match(mark('A'))).toBe(true);
    });
});
