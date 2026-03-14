import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useElementHeight } from './useElementHeight';

class ResizeObserverMock {
    static instances: ResizeObserverMock[] = [];

    callback: ResizeObserverCallback;
    disconnect = vi.fn();
    observe = vi.fn();

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        ResizeObserverMock.instances.push(this);
    }

    trigger(height: number) {
        this.callback(
            [
                {
                    contentRect: { height } as DOMRectReadOnly,
                } as ResizeObserverEntry,
            ],
            this as unknown as ResizeObserver
        );
    }
}

function HeightHarness({
    attachRef = true,
}: {
    attachRef?: boolean;
}) {
    const [ref, height] = useElementHeight<HTMLDivElement>();

    return (
        <div>
            {attachRef ? <div ref={ref}>Measured</div> : null}
            <span data-testid="height">{height}</span>
        </div>
    );
}

afterEach(() => {
    ResizeObserverMock.instances.length = 0;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('useElementHeight', () => {
    it('returns zero when no element is mounted', () => {
        const view = render(<HeightHarness attachRef={false} />);

        expect(view.getByTestId('height').textContent).toBe('0');
    });

    it('uses the bounding client rect when ResizeObserver is unavailable', async () => {
        vi.stubGlobal('ResizeObserver', undefined);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
            {
                height: 24,
            } as DOMRect
        );
        const view = render(<HeightHarness />);

        await waitFor(() => {
            expect(view.getByTestId('height').textContent).toBe('24');
        });
    });

    it('measures when the ref attaches after the first render', async () => {
        vi.stubGlobal('ResizeObserver', undefined);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
            {
                height: 36,
            } as DOMRect
        );
        const view = render(<HeightHarness attachRef={false} />);

        expect(view.getByTestId('height').textContent).toBe('0');

        view.rerender(<HeightHarness attachRef />);

        await waitFor(() => {
            expect(view.getByTestId('height').textContent).toBe('36');
        });
    });

    it('updates height from ResizeObserver notifications and disconnects on unmount', async () => {
        vi.stubGlobal('ResizeObserver', ResizeObserverMock);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
            {
                height: 24,
            } as DOMRect
        );
        const view = render(<HeightHarness />);

        await waitFor(() => {
            expect(view.getByTestId('height').textContent).toBe('24');
        });

        ResizeObserverMock.instances[0]?.trigger(48);

        await waitFor(() => {
            expect(view.getByTestId('height').textContent).toBe('48');
        });

        const instance = ResizeObserverMock.instances[0];
        view.unmount();

        expect(instance?.disconnect).toHaveBeenCalledTimes(1);
    });
});
