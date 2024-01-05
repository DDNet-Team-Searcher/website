import classNames from 'classnames';
import { useAppDispatch } from '@/utils/hooks/hooks';
import {
    Event as EventType,
    Happenings,
    Status,
} from '@app/shared/types/Happening.type';
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
import { StartHappeningResponse } from '@app/shared/types/api.type';
import { ActionButtons } from '../ActionButtons';
import Link from 'next/link';
import { BaseHappeningProps } from '../types';
import {
    CreateAndUpdateHappeningModal,
    ModalMode,
} from '@/components/CreateAndUpdateHappeningModal';
import { useState } from 'react';
import { getMapUrl } from '@/utils/getMapUrl';
import { HappeningPeopleIcon } from '@/components/ui/Icons/HappeningPeople';
import { BellIcon } from '@/components/ui/Icons/Bell';
import { CheckMarkIcon } from '@/components/ui/Icons/CheckMark';
import { MAX_DESCRIPTION_LENGTH } from '../constants';
import { cropString } from '@/utils/cropString';

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
        isInterested,
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
    const [isEditEventModalVisible, setISEditEventModalVisible] =
        useState(false);

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
                        isInterested: !isInterested,
                        type: 'event',
                    }),
                );
            } catch (e) {
                console.log(e);
            }
        };
    };

    const editEvent = async () => {
        setISEditEventModalVisible(true);
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

    const thumbnailUrl = thumbnail || getMapUrl(mapName);

    const onClose = () => {
        setISEditEventModalVisible(false);
    };

    const eventData = {
        place,
        mapName,
        teamSize: '',
        startDate: new Date(startAt).toISOString().substring(0, 10),
        startTime: new Date(startAt).toISOString().substring(11, 16),
        description: description || '',

        // event's fields
        endDate: event.endAt
            ? new Date(event.endAt).toISOString().substring(0, 10)
            : '',
        endTime: event.endAt
            ? new Date(event.endAt).toISOString().substring(11, 16)
            : '',
        title,
        thumbnail: null,
    };

    //FIXME: had to remove hover:scale-[1.01] in className because it lookes cursed as fuck
    return (
        <div
            className={classNames(
                'max-w-[530px] w-full bg-primary-2 rounded-[10px] flex flex-col transition-all duration-150',
                { [className || '']: !!className },
            )}
        >
            <CreateAndUpdateHappeningModal
                onClose={onClose}
                type="event"
                data={eventData}
                happeningId={id}
                mode={ModalMode.Edit}
                isVisible={isEditEventModalVisible}
            />
            <div className="p-2.5 grow-[1] flex flex-col">
                <div className="flex justify-between">
                    <StartTime startAt={startAt} status={status} />
                    <Link href={`/profile/${authorId}`} className="ml-auto">
                        <Avatar src={avatar} username={username} />
                    </Link>
                    <div className="bg-primary-3 text-high-emphasis px-[7px] py-[3px] rounded-full flex items-center ml-2.5">
                        <HappeningPeopleIcon color="var(--high-emphasis)" />
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
                            {cropString(description || "", MAX_DESCRIPTION_LENGTH)}
                        </p>
                    </div>
                    <img
                        src={thumbnailUrl}
                        className="max-w-[220px] w-full shrink-0 ml-3 max-h-[95px] rounded-[10px] object-cover"
                        alt="map thumbnail"
                    />
                </div>
                <hr className="w-full border-[1] border-[#3F362B] mt-2.5 mb-4" />
                <div className="flex justify-between mt-auto items-center">
                    <Place place={place} />
                    <div className="flex">
                        <ActionButtons
                            type={Happenings.Event}
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
                                        isInterested,
                                },
                            )}
                            onClick={setIsInterestedCb(id)}
                        >
                            {isInterested ?
                                <CheckMarkIcon className="mr-2.5" color="var(--app-primary-1)" />
                                :
                                <BellIcon
                                    className="mr-2.5"
                                    color="var(--high-emphasis)"
                                />
                            }
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
