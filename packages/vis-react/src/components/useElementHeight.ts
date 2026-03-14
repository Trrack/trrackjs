import { useCallback, useLayoutEffect, useState } from 'react';

export function useElementHeight<T extends HTMLElement>(): [
    (node: T | null) => void,
    number,
] {
    const [element, setElement] = useState<T | null>(null);
    const [height, setHeight] = useState(0);
    const ref = useCallback((node: T | null) => {
        setElement(node);
    }, []);

    useLayoutEffect(() => {
        if (!element) {
            setHeight(0);
            return undefined;
        }

        const updateHeight = () => {
            setHeight(element.getBoundingClientRect().height);
        };

        updateHeight();

        if (typeof ResizeObserver === 'undefined') {
            return undefined;
        }

        const observer = new ResizeObserver((entries) => {
            const nextHeight = entries[0]?.contentRect.height;
            setHeight(nextHeight ?? element.getBoundingClientRect().height);
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [element]);

    return [ref, height];
}
