import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BookmarkButton } from './BookmarkButton';

describe('BookmarkButton', () => {
    it('updates hover styling, uses the correct label for bookmark state, and triggers clicks', () => {
        const onClick = vi.fn();
        const view = render(
            <BookmarkButton
                color="cornflowerblue"
                isBookmarked={false}
                onClick={onClick}
            />
        );
        const button = view.getByLabelText('Add bookmark') as HTMLButtonElement;

        expect(button.style.color).toBe('lightgray');
        fireEvent.mouseEnter(button);
        expect(button.style.color).toBe('cornflowerblue');
        fireEvent.mouseLeave(button);
        expect(button.style.color).toBe('lightgray');

        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);

        view.rerender(
            <BookmarkButton
                color="cornflowerblue"
                isBookmarked={true}
                onClick={onClick}
            />
        );

        expect(view.getByLabelText('Remove bookmark')).toBeTruthy();
        expect(
            (view.getByLabelText('Remove bookmark') as HTMLButtonElement).style
                .color
        ).toBe('cornflowerblue');
    });
});
