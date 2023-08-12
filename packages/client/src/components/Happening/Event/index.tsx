import classNames from 'classnames';
import { useAppDispatch } from '@/utils/hooks/hooks';
import {
    Event as EventType,
    Happenings,
    Status,
} from '@/types/Happenings.type';
import { hint } from '@/store/slices/hints';
import {
    useDeleteHappeningMutation,
    useLazyEndHappeningQuery,
    useSetIsInterestedInHappeningMutation,
    useLazyStartHappeningQuery,
} from '@/features/api/happenings.api';
import { StartTime } from '../StartTime';
import { Avatar } from '@/components/Avatar';
import { Place } from '../Place';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ExcludeSuccess } from '@/types/Response.type';
import { StartHappeningResponse } from '@/types/api.type';
import { ActionButtons } from '../ActionButtons';
import Link from 'next/link';
import { BaseHappeningProps } from '../types';

type OwnProps = BaseHappeningProps & {
    event: EventType;
};

export function Event({
    className,
    event,
    setStatusDispatch,
    deleteDispatch,
    setIsInterestedDispatch,
}: OwnProps) {
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
    const [startEventQuery] = useLazyStartHappeningQuery();
    const [endEventQuery] = useLazyEndHappeningQuery();
    const [deleteEventQuery] = useDeleteHappeningMutation();
    const [setIsUserInterestedInHappening] =
        useSetIsInterestedInHappeningMutation();
    const isUserInterestedInEvent = !!interested.length;

    const endEvent = async (id: number) => {
        try {
            await endEventQuery(id).unwrap();
            dispatch(
                setStatusDispatch({
                    id,
                    type: 'event',
                    status: Status.Finished,
                }),
            );
        } catch (e) {
            console.log(e);
        }
    };

    const startEvent = async (id: number) => {
        try {
            await startEventQuery(id).unwrap();
            dispatch(
                setStatusDispatch({
                    id,
                    type: 'run',
                    status: Status.Happening,
                }),
            );
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<StartHappeningResponse>;

            if (
                error.status === 'fail' &&
                error.data.reason == 'NO_EMPTY_SERVERS'
            ) {
                dispatch(
                    hint({
                        type: 'error',
                        text: error.message!,
                    }),
                );
            }

            console.log(err);
        }
    };

    const deleteEvent = async (id: number) => {
        try {
            await deleteEventQuery(id).unwrap();
            dispatch(deleteDispatch({ type: 'event', id }));
        } catch (e) {
            console.log(e);
        }
    };

    const setIsInterestedCb = (id: number) => {
        return async () => {
            try {
                setIsUserInterestedInHappening(id);
                dispatch(
                    setIsInterestedDispatch({
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

    const editEvent = async () => {
        alert('Eeeeh.. It doesnt rly work lmao');
    };

    const onClick = () => {
        dispatch(
            setHappeningInfoModalData({
                type: Happenings.Event,
                happening: event,
                visible: true,
            }),
        );
    };

    //TODO: fix this shit kek
    const thumbnailUrl =
        thumbnail ||
        `https://ddnet.org/ranks/maps/${mapName.replaceAll(' ', '_')}.png`;

    return (
        <div
            className={classNames(
                'max-w-[530px] w-full bg-primary-2 rounded-[10px] flex flex-col hover:scale-[1.01] transition-all duration-150',
                { [className || '']: !!className },
            )}
        >
            <div className="p-2.5 grow-[1] flex flex-col">
                <div className="flex justify-between">
                    <StartTime startAt={startAt} status={status} />
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
                    <Place place={place} />
                    <div className="flex">
                        <ActionButtons
                            status={status}
                            deleteHappening={deleteEvent}
                            endHappening={endEvent}
                            editHappening={editEvent}
                            startHappening={startEvent}
                            happeningId={id}
                            authorId={authorId}
                        />
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
}
