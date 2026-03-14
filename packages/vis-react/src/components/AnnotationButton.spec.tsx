import { fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { AnnotationButton } from './AnnotationButton';

function AnnotationHarness() {
    const [annotation, setAnnotation] = useState('Initial');
    const [annotationOpen, setAnnotationOpen] = useState(false);

    return (
        <>
            <div data-testid="saved-annotation">{annotation}</div>
            <AnnotationButton
                annotation={annotation}
                annotationOpen={annotationOpen}
                color="cornflowerblue"
                setAnnotation={setAnnotation}
                setAnnotationOpen={setAnnotationOpen}
            />
        </>
    );
}

describe('AnnotationButton', () => {
    it('updates hover styling, closes without saving, and saves when requested', () => {
        const view = render(<AnnotationHarness />);
        const wrapper = view.getByLabelText('Edit annotation')
            .parentElement as HTMLDivElement;

        expect(wrapper.style.color).toBe('lightgray');
        fireEvent.mouseEnter(wrapper);
        expect(wrapper.style.color).toBe('cornflowerblue');
        fireEvent.mouseLeave(wrapper);
        expect(wrapper.style.color).toBe('lightgray');

        fireEvent.click(view.getByLabelText('Edit annotation'));
        fireEvent.change(view.getByLabelText('Annotation'), {
            target: { value: 'Draft change' },
        });
        fireEvent.mouseDown(document.body);

        expect(view.queryByLabelText('Annotation')).toBeNull();
        expect(view.getByTestId('saved-annotation').textContent).toBe('Initial');

        fireEvent.click(view.getByLabelText('Edit annotation'));
        fireEvent.change(view.getByLabelText('Annotation'), {
            target: { value: 'Close without save' },
        });
        fireEvent.click(view.getByText('Close'));

        expect(view.queryByLabelText('Annotation')).toBeNull();
        expect(view.getByTestId('saved-annotation').textContent).toBe('Initial');

        fireEvent.click(view.getByLabelText('Edit annotation'));
        fireEvent.change(view.getByLabelText('Annotation'), {
            target: { value: 'Saved change' },
        });
        fireEvent.click(view.getByText('Save'));

        expect(view.getByTestId('saved-annotation').textContent).toBe(
            'Saved change'
        );
    });
});
