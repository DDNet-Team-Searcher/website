import { useEffect } from 'react';

export function useOutsideClickHandler<T extends HTMLElement>(
    ref: React.RefObject<T>,
    condition: boolean,
    callback: () => void,
): void {
    const handleOutsideClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (ref.current && !ref.current.contains(target) && condition) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [condition]);
}
