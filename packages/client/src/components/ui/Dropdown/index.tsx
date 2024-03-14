import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import classNames from 'classnames';
import { useRef } from 'react';

export type Item = {
    label: React.ReactNode;
    key: string;
};

type OwnProps = {
    menu: {
        items: Item[];
        onClick: (item: Item) => void;
    };
    onOpenChange: () => void;
    children: React.ReactNode;
    open: boolean;
};

export function Dropdown({
    children,
    menu: { items, onClick },
    open,
    onOpenChange,
}: OwnProps) {
    const ref = useRef<HTMLUListElement>(null);
    useOutsideClickHandler(ref, open, onOpenChange);

    return (
        <div className="relative">
            <div onClick={onOpenChange}>{children}</div>
            <ul
                ref={ref}
                className={classNames(
                    'absolute l-0 z-[1] min-w-[max(100%,200px)] bg-primary-2 top-[125%] rounded-[10px]',
                    { hidden: !open },
                )}
            >
                {items.map((item) => (
                    <li key={item.key} onClick={() => onClick(item)}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}
