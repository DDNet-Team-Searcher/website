import { getMapUrl } from '@/utils/getMapUrl';
import { Happenings, Status } from '@app/shared/types/Happening.type';
import { MAX_DESCRIPTION_LENGTH } from './constants';
import { cropString } from '@/utils/cropString';
import { TeeIcon } from '../ui/Icons/Tee';
import { MapIcon } from '../ui/Icons/Map';
import { Avatar } from '../Avatar';
import { ActionButtons } from './ActionButtons';
import { CheckMarkIcon } from '../ui/Icons/CheckMark';
import classNames from 'classnames';
import { BellIcon } from '../ui/Icons/Bell';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ExcludeSuccess } from '@app/shared/types/Response.type';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { hint } from '@/store/slices/hints';
import { StartHappeningResponse } from '@app/shared/types/api.type';
import {
    useDeleteHappeningMutation,
    useLazyEndHappeningQuery,
    useLazyStartHappeningQuery,
    useSetIsInterestedInHappeningMutation,
} from '@/features/api/happenings.api';
import {
    CreateAndUpdateHappeningModal,
    FormFields,
    ModalMode,
} from '../CreateAndUpdateHappeningModal';
import { useState } from 'react';
import { setHappeningInfoModalData } from '@/store/slices/app';
import Link from 'next/link';
import {
    deleteHappening,
    setIsInterestedInHappening,
    setStatus,
} from '@/store/slices/happenings';
import { StartTime } from './StartTime';

type OwnProps = {
    id: number;
};

export function Happening({ id }: OwnProps) {
    const dispatch = useAppDispatch();
    const happenings = useAppSelector((state) => state.happenings.happenings);
    const happening = happenings.find((happening) => happening.id === id)!;
    const type = happening.type;
    const [startHappeningQuery] = useLazyStartHappeningQuery();
    const [endHappeningQuery] = useLazyEndHappeningQuery();
    const [deleteHappeningMutation] = useDeleteHappeningMutation();
    const [setIsInterestedInHappeningMutation] =
        useSetIsInterestedInHappeningMutation();
    const [isEditHappeningModalVisible, setIsEditHappeningModalVisible] =
        useState(false);
    const { mapName, isInterested } = happening;
    const authorId = happening.author.id;
    const description = cropString(
        happening.description || '',
        MAX_DESCRIPTION_LENGTH,
    );
    let thumbnailUrl = getMapUrl(mapName);
    if (type == Happenings.Event && happening.thumbnail) {
        thumbnailUrl = happening.thumbnail;
    }

    const startHappening = async (id: number) => {
        try {
            await startHappeningQuery(id).unwrap();
            dispatch(
                setStatus({
                    id,
                    status: Status.Happening,
                }),
            );
        } catch (err: unknown) {
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

    const endHappening = async (id: number) => {
        try {
            await endHappeningQuery(id).unwrap();
            dispatch(
                setStatus({
                    id,
                    status: Status.Finished,
                }),
            );
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const deleteEvent = async (id: number) => {
        try {
            await deleteHappeningMutation(id).unwrap();
            dispatch(deleteHappening(id));
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const editHappening = () => {
        setIsEditHappeningModalVisible(true);
    };

    const setIsInterestedCb = async (id: number) => {
        try {
            await setIsInterestedInHappeningMutation(id).unwrap();
            dispatch(
                setIsInterestedInHappening({
                    id,
                    isInterested: !isInterested,
                }),
            );
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const onClose = () => {
        setIsEditHappeningModalVisible(false);
    };

    const happeningData: FormFields = {
        mapName,
        description: happening.description || '',
        place: happening.place,
        startDate: new Date(happening.startAt).toISOString().substring(0, 10),
        startTime: new Date(happening.startAt).toISOString().substring(11, 16),
        thumbnail: null,
        teamSize: '',
        title: '',
        endDate: '',
        endTime: '',
    };

    if (type === Happenings.Event) {
        if (happening.thumbnail) {
            fetch(happening.thumbnail).then(async (response) => {
                const ct = response.headers.get('content-type');
                const blob = await response.blob();
                const file = new File([blob], 'foo', { type: ct! });
                happeningData.thumbnail = file;
            });
        }
        happeningData.title = happening.title;
        happeningData.endDate = happening.endAt
            ? new Date(happening.endAt).toISOString().substring(0, 10)
            : '';
        happeningData.endTime = happening.endAt
            ? new Date(happening.endAt).toISOString().substring(11, 16)
            : '';
    } else if (type === Happenings.Run) {
        happeningData.teamSize = happening.teamSize.toString();
    }

    const openHappeningInfoModal = () => {
        dispatch(
            setHappeningInfoModalData({
                happeningId: happening.id,
                visible: true,
            }),
        );
    };

    return (
        <div className="basis-[255px] max-w-[260px] grow rounded-[10px] bg-primary-2 flex flex-col">
            <img
                alt="event thumbnail"
                src={thumbnailUrl}
                className="rounded-t-[10px] w-full max-h-[100px] object-cover hover:cursor-pointer"
                onClick={openHappeningInfoModal}
            />
            <div className="px-4 py-2.5 grow flex flex-col">
                <StartTime
                    startAt={happening.startAt}
                    status={happening.status}
                />
                {type == Happenings.Event && (
                    <p className="text-high-emphasis text-lg">
                        {happening.title}
                    </p>
                )}
                <p className="text-medium-emphasis">{description}</p>
                {type === Happenings.Run && (
                    <div className="flex mt-2.5">
                        <TeeIcon color="var(--high-emphasis)" />
                        <span className="text-high-emphasis ml-3.5">
                            {happening._count.inTeam}/{happening.teamSize}
                        </span>
                    </div>
                )}
                <div className="flex mt-1">
                    <MapIcon color="var(--high-emphasis)" />
                    <span className="text-high-emphasis ml-3.5">{mapName}</span>
                </div>
                <div className="flex items-center mt-1 mb-4">
                    <span className="text-high-emphasis">Made by</span>
                    <Link href={`profile/${happening.author.id}`}>
                        <Avatar
                            src={happening.author.avatar}
                            username={happening.author.username}
                            className="ml-3.5"
                        />
                    </Link>
                </div>
                <div className="flex justify-between mt-auto">
                    <ActionButtons
                        type={type}
                        status={happening.status}
                        deleteHappening={deleteEvent}
                        endHappening={endHappening}
                        editHappening={editHappening}
                        startHappening={startHappening}
                        happeningId={id}
                        authorId={authorId}
                    />
                    <button
                        className={classNames(
                            'py-1 px-2.5 bg-primary-3 text-high-emphasis rounded-[5px] flex items-center ml-2.5',
                            {
                                'bg-[#383129] !text-primary-1': isInterested,
                            },
                        )}
                        onClick={() => setIsInterestedCb(id)}
                    >
                        {isInterested ? (
                            <CheckMarkIcon
                                className="mr-2.5"
                                color="var(--app-primary-1)"
                            />
                        ) : (
                            <BellIcon
                                className="mr-2.5"
                                color="var(--high-emphasis)"
                            />
                        )}
                        Interested
                    </button>
                </div>
            </div>

            <CreateAndUpdateHappeningModal
                onClose={onClose}
                type={type}
                data={happeningData as FormFields}
                happeningId={id}
                mode={ModalMode.Edit}
                isVisible={isEditHappeningModalVisible}
            />
        </div>
    );
}
