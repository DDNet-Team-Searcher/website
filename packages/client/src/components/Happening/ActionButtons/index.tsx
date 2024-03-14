import { Happenings, Status } from '@app/shared/types/Happening.type';
import classNames from 'classnames';
import { useState } from 'react';
import { useAppSelector } from '@/utils/hooks/hooks';
import { Dropdown, Item } from '@/components/ui/Dropdown';

type OwnProps = {
    type: Happenings;
    authorId: number;
    happeningId: number;
    status: Status;
    startHappening: (happeningId: number) => void;
    editHappening: (happeningId: number) => void;
    endHappening: (happeningId: number) => void;
    deleteHappening: (happeningId: number) => void;
};

export function ActionButtons({
    startHappening,
    editHappening,
    endHappening,
    deleteHappening,
    type,
    status,
    happeningId,
    authorId,
}: OwnProps) {
    const [open, setOpen] = useState(false);
    const userId = useAppSelector((state) => state.user.user.id);
    const owner = authorId == userId;
    const happeningType = type.toLowerCase();
    const itemClass =
        'w-full text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left';
    const normalItemClass = `${itemClass} hover:bg-primary-1`;
    const dangerousItemClass = `${itemClass} hover:bg-error`;
    const items: Item[] = [
        {
            key: '1',
            label: (
                <button
                    className={classNames(normalItemClass, {
                        hidden: !owner || status !== Status.NotStarted,
                    })}
                >
                    Start {happeningType}
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button
                    className={classNames(normalItemClass, {
                        hidden: !owner,
                    })}
                >
                    Edit {happeningType}
                </button>
            ),
        },
        {
            key: '3',
            label: (
                <button
                    className={classNames(dangerousItemClass, {
                        hidden: !owner || status !== Status.Happening,
                    })}
                >
                    End {happeningType}
                </button>
            ),
        },
        {
            key: '4',
            label: (
                <button
                    className={classNames(dangerousItemClass, {
                        hidden: !owner || status === Status.Happening,
                    })}
                >
                    Delete {happeningType}
                </button>
            ),
        },
    ];

    const handleMenuClick = (item: Item) => {
        setOpen(false);

        switch (item.key) {
            case '1':
                startHappening(happeningId);
                break;
            case '2':
                editHappening(happeningId);
                break;
            case '3':
                endHappening(happeningId);
                break;
            case '4':
                deleteHappening(happeningId);
                break;
        }
    };

    const handleOpenChange = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Dropdown
            open={open}
            menu={{ items, onClick: handleMenuClick }}
            onOpenChange={handleOpenChange}
            className={{ container: '!bg-[#15120D]' }}
        >
            <button className="text-high-emphasis flex">...</button>
        </Dropdown>
    );
}
