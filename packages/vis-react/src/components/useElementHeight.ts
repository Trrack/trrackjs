import { MutableRefObject, useEffect, useRef, useState } from 'react';

export function useElementHeight<T extends HTMLElement>(): [
    MutableRefObject<T | null>,
    number,
] {
    const ref = useRef<T>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
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
    }, []);

    return [ref, height];
}
