import { describe, expect, it } from 'vitest';

import translate from './translate';

describe('translate', () => {
    it('returns an svg translate string', () => {
        expect(translate(12, -4)).toBe('translate(12, -4)');
    });
});
