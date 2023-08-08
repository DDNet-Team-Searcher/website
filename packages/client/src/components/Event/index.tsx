import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useRef, useState } from 'react';
import { Event as EventType, Happenings, Status } from '@/types/Happenings.type';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import Link from 'next/link';
import { hint } from '@/store/slices/hints';
import {
    useDeleteHappeningMutation,
    useLazyEndHappeningQuery,
    useSetIsInterestedInHappeningMutation,
    useLazyStartHappeningQuery,
} from '@/features/api/happenings.api';
import {
    deleteHappening,
    setHappeningStatus,
    setIsInterestedInHappening,
} from '@/store/slices/happenings';
import { HappeningStartTime } from '../HappeningStartTime';
import { Avatar } from '../Avatar';
import { HappeningPlace } from '../HappeningPlace';
import { setHappeningInfoModalData } from '@/store/slices/app';

type OwnProps = {
    event: EventType;
    className?: string;
};

export const Event = ({ className, event }: OwnProps) => {
    const {
        description,
        id,
        title,
        mapName,
        place,
        startAt,
        status,
        interestedPlayers: interested,
        author: { id: authorId, username, avatar },
        _count: { interestedPlayers },
        thumbnail,
    } = event;

    const dispatch = useAppDispatch();
    const [startEvent] = useLazyStartHappeningQuery();
    const [endEvent] = useLazyEndHappeningQuery();
    const [deleteEvent] = useDeleteHappeningMutation();
    const [setIsUserInterestedInHappening] =
        useSetIsInterestedInHappeningMutation();
    const userId = useAppSelector((state) => state.user.user.id);
    const isOwner = authorId == userId;
    const [isShowMorePanelHidden, setIsShowMorePanelHidden] = useState(true);
    const ref = useRef<null | HTMLDivElement>(null);
    const isUserInterestedInEvent = !!interested.length;

    const handleOnClickOutside = () => {
        setIsShowMorePanelHidden(true);
    };

    useOutsideClickHandler(ref, !isShowMorePanelHidden, handleOnClickOutside);

    const endEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await endEvent(id).unwrap();
                dispatch(
                    setHappeningStatus({
                        id,
                        type: 'event',
                        status: Status.Finished,
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const startEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await startEvent(id).unwrap();
                dispatch(
                    setHappeningStatus({
                        id,
                        type: 'run',
                        status: Status.Happening,
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const deleteEventCb = (id: number) => {
        return async () => {
            setIsShowMorePanelHidden(true);
            try {
                await deleteEvent(id).unwrap();
                dispatch(deleteHappening({ type: 'event', id }));
            } catch (e) {
                console.log(e);
            }
        };
    };

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                setIsUserInterestedInHappening(id);
                dispatch(
                    setIsInterestedInHappening({
                        id,
                        isInterested: !!!interested.length,
                        type: 'event',
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const editEventCb = () => {
        setIsShowMorePanelHidden(true);
        // dispatch(setIsEditHappeningModalHidden(false))
        // dispatch(setEditingHappeningId(id))
        // dispatch(setEditingHappeningType("event"))
    };

    const onClick = () => {
        dispatch(setHappeningInfoModalData({
            type: Happenings.Event,
            happeningId: event.id,
            visible: true
        }));
    }

    const thumbnailUrl = thumbnail || `https://ddnet.org/ranks/maps/${mapName.replaceAll(' ', '_')}.png`;

    return (
        <div
            className={classNames(
                'max-w-[530px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150',
                { [className || '']: !!className },
            )}
        >
            <div className="p-2.5 grow-[1] flex flex-col">
                <div className="flex justify-between">
                    <HappeningStartTime startAt={startAt} status={status} />
                    <Link href={`/profile/${authorId}`} className="ml-auto">
                        <Avatar src={null} username={username} />
                    </Link>
                    <div className="bg-primary-3 text-high-emphasis px-[7px] py-[3px] rounded-full flex items-center ml-2.5">
                        <img src="/run-people.svg" />
                        <span className="text-[12px] ml-1">
                            {interestedPlayers}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between mt-5">
                    <div>
                        <p
                            className="text-high-emphasis font-semibold cursor-pointer"
                            onClick={onClick}
                        >
                            {title}
                        </p>
                        <p className="mt-1 text-medium-emphasis">
                            {description}
                        </p>
                    </div>
                    <img
                        src={thumbnailUrl}
                        className="max-w-[220px] w-full max-h-[95px] rounded-[10px] object-cover"
                        alt="map thumbnail"
                    />
                </div>
                <hr className="w-full border-[1] border-[#3F362B] mt-2.5 mb-4" />
                <div className="flex justify-between mt-auto items-center">
                    <HappeningPlace place={place} />
                    <div className="flex">
                        <div className="relative">
                            <button
                                className="text-high-emphasis flex"
                                onClick={() =>
                                    setIsShowMorePanelHidden(
                                        !isShowMorePanelHidden,
                                    )
                                }
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
                                        onClick={startEventCb(id)}
                                    >
                                        Start Event
                                    </button>
                                )}
                                {isOwner && (
                                    <button
                                        className="text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-primary-1"
                                        onClick={editEventCb}
                                    >
                                        Edit Event
                                    </button>
                                )}
                                {isOwner && status == Status.Happening && (
                                    <button
                                        className={
                                            'text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error'
                                        }
                                        onClick={endEventCb(id)}
                                    >
                                        End Event
                                    </button>
                                )}
                                {isOwner && status != Status.Happening && (
                                    <button
                                        className={
                                            'text-high-emphasis py-2.5 px-4 rounded-[10px] transition-all duration-200 cursor-pointer text-left hover:bg-error'
                                        }
                                        onClick={deleteEventCb(id)}
                                    >
                                        Delete Event
                                    </button>
                                )}
                            </div>
                        </div>
                        <button
                            className={classNames(
                                'py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5',
                                {
                                    'bg-[#383129] !text-primary-1':
                                        isUserInterestedInEvent,
                                },
                            )}
                            onClick={setIsInterestedCb(id)}
                        >
                            <img
                                className="mr-2.5"
                                src={
                                    isUserInterestedInEvent
                                        ? '/check-mark.png'
                                        : '/run-bell.svg'
                                }
                            />
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
