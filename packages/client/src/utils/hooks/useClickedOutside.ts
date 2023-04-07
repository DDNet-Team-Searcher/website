import { useEffect } from 'react';

export const useOutsideClickHandler = <T extends HTMLElement>(
    ref: React.RefObject<T>,
    condition: boolean,
    callback: () => void,
) => {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const dataset = ref.current?.dataset || {};
            if (
                condition &&
                !(e?.target as Element).closest(
                    Object.keys(dataset)
                        .map((key) => `[data-${key}="${dataset[key]}"]`)
                        .join(' ') || '',
                )
            ) {
                callback();
            }
        };

        const handler2 = () => {
            document.addEventListener('click', handler);
            document.removeEventListener('mouseup', handler2);
        };

        document.addEventListener('mouseup', handler2);

        return () => {
            document.removeEventListener('click', handler);
        };
    }, [condition]);
};
