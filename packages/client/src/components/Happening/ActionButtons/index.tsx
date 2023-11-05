import { Happenings, Status } from '@app/shared/types/Happening.type';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useAppSelector } from '@/utils/hooks/hooks';

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
    startHappening: startHappeningProp,
    editHappening: editHappeningProp,
    endHappening: endHappeningProp,
    deleteHappening: deleteHappeningProp,
    type,
    status,
    happeningId,
    authorId,
}: OwnProps) {
    const ref = useRef<null | HTMLDivElement>(null);
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true);
    const userId = useAppSelector((state) => state.user.user.id);
    const isOwner = authorId == userId;

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true);
    };

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside);

    const startHappening = async () => {
        setIsShowMorePanelHidden(true);
        startHappeningProp(happeningId);
    };

    const editHappening = async () => {
        setIsShowMorePanelHidden(true);
        editHappeningProp(happeningId);
    };

    const endHappening = async () => {
        setIsShowMorePanelHidden(true);
        endHappeningProp(happeningId);
    };

    const deleteHappening = async () => {
        setIsShowMorePanelHidden(true);
        deleteHappeningProp(happeningId);
    };

    const happeningType = type.toLowerCase()

    return (
        <div className="relative">
            <button
                className="text-high-emphasis flex"
                onClick={() => setIsShowMorePanelHidden(!isShowMorePanelHidden)}
            >
                ...
            </button>
            <div
                data-hidden={isShowMorePanelHidden}
                ref={ref}
                className={classNames(
                    {
                        'absolute min-w-[200px] l-2.5 bg-[#15120D] flex flex-col rounded-[10px]':
                            !isShowMorePanelHidden,
                    },
                    { hidden: isShowMorePanelHidden },
                )}
            >
                {isOwner && status == Status.NotStarted && (
                    <button
                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1"
                        onClick={startHappening}
                    >
                        Start {happeningType}
                    </button>
                )}
                {isOwner && (
                    <button
                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1"
                        onClick={editHappening}
                    >
                        Edit {happeningType}
                    </button>
                )}
                {isOwner && status == Status.Happening && (
                    <button
                        className={
                            'text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error'
                        }
                        onClick={endHappening}
                    >
                        End {happeningType}
                    </button>
                )}
                {isOwner && status != Status.Happening && (
                    <button
                        className={
                            'text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error'
                        }
                        onClick={deleteHappening}
                    >
                        Delete {happeningType}
                    </button>
                )}
            </div>
        </div>
    );
}
