import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { defaultDarkmodeIcon, defaultIcon } from './IconConfig';

describe('IconConfig', () => {
    it('renders the default light icon variants', () => {
        const icons = defaultIcon('tomato');
        const view = render(<svg>{icons.currentGlyph()}</svg>);
        const circle = view.container.querySelector('circle');

        expect(circle?.getAttribute('fill')).toBe('tomato');
        expect(circle?.getAttribute('stroke')).toBe('tomato');

        view.rerender(<svg>{icons.hoverGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('r')).toBe(
            '6'
        );

        view.rerender(<svg>{icons.backboneGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('fill')).toBe(
            'white'
        );

        view.rerender(<svg>{icons.bundleGlyph()}</svg>);
        expect(
            view.container.querySelector('circle')?.getAttribute('stroke')
        ).toBe('tomato');
    });

    it('renders the default dark-mode icon variants with a computed stroke color', () => {
        const icons = defaultDarkmodeIcon('cornflowerblue');
        const view = render(<svg>{icons.glyph()}</svg>);
        const circle = view.container.querySelector('circle');

        expect(circle?.getAttribute('fill')).toBe('#413839');
        expect(circle?.getAttribute('stroke')).toBeTruthy();

        view.rerender(<svg>{icons.currentGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('fill')).toBe(
            view.container.querySelector('circle')?.getAttribute('stroke')
        );

        view.rerender(<svg>{icons.backboneGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('fill')).toBe(
            '#413839'
        );

        view.rerender(<svg>{icons.bundleGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('fill')).toBe(
            '#413839'
        );

        view.rerender(<svg>{icons.hoverGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('r')).toBe(
            '6'
        );
    });

    it('handles invalid dark-mode colors without throwing', () => {
        const icons = defaultDarkmodeIcon('not-a-color');
        const view = render(<svg>{icons.currentGlyph()}</svg>);
        const circle = view.container.querySelector('circle');

        expect(circle?.getAttribute('fill')).toBe(null);
        expect(circle?.getAttribute('stroke')).toBe(null);

        view.rerender(<svg>{icons.hoverGlyph()}</svg>);
        expect(view.container.querySelector('circle')?.getAttribute('r')).toBe(
            '6'
        );
    });
});
