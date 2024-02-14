'use client';

import { Modal } from '@/components/ui/Modal';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Avatar } from '@/components/Avatar';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Event, Happenings, Status } from '@app/shared/types/Happening.type';
import { StartTime } from '@/components/Happening/StartTime';
import { Place } from '@/components/Happening/Place';
import {
    useGetHappeningInterestedPlayersQuery,
    useGetReviewsQuery,
    useUpdateIsPlayerInTeamMutation,
} from '@/features/api/happenings.api';
import { InterestedPlayer } from './InterestedPlayer';
import { Review } from './Review';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { getMapUrl } from '@/utils/getMapUrl';
import { MapIcon } from '../ui/Icons/Map';
import { TeeIcon } from '../ui/Icons/Tee';
import { Carousel, CarouselRef } from '../ui/Carousel';

export function HappeningInfoModal() {
    const dispatch = useAppDispatch();
    const { type, visible, happening } = useAppSelector(
        (state) => state.app.happeningInfoModal,
    );
    const {
        data: interestedPlayers,
        isSuccess: interestedPlayersSuccess,
        refetch: refetchInterestedPlayers,
    } = useGetHappeningInterestedPlayersQuery(happening?.id || 0);
    const [updateIsPlayerInTeam] = useUpdateIsPlayerInTeamMutation();
    const authedUserId = useAppSelector((state) => state.user.user.id);
    const { data: reviews } = useGetReviewsQuery(happening?.id || 0);
    let isUserInTeam: number | null = null;
    const ref = useRef<CarouselRef | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        ref.current?.goTo(activeTab);
    }, [activeTab]);

    if (happening?.id && interestedPlayers?.status === 'success') {
        isUserInTeam =
            interestedPlayers?.data?.interestedPlayers?.find(
                (user) => user.user.id === authedUserId,
            )?.user.id || null;
    }

    const onClose = () => {
        dispatch(
            setHappeningInfoModalData({
                type: null,
                happening: null,
                visible: false,
            }),
        );
    };

    if (!happening) return <></>;

    const inputCb = (authorId: number, userId: number) => {
        return async () => {
            if (authorId == userId) return;

            await updateIsPlayerInTeam({ happeningId: happening.id, userId });
            refetchInterestedPlayers();
        };
    };

    const copyConnectData = async () => {
        if (happening?.connectString) {
            await navigator.clipboard.writeText(happening?.connectString);
            alert(
                'The needed thing was copied in your clipboard. Now just open client, press F1, paste this stuff and have a nice game!',
            );
        } else {
            alert(
                'Seems like something fucked up and you cant get server connect data :p',
            );
        }
    };

    let thumbnailUrl = getMapUrl(happening.mapName);

    if ((happening as Event).thumbnail) {
        thumbnailUrl = (happening as Event).thumbnail!;
    }

    return (
        <Modal visible={visible} width={'600px'} onClose={onClose}>
            <img
                src={thumbnailUrl}
                className="max-w-full w-full max-h-[200px] object-cover rounded-t-[10px]"
                alt="ddnet map thumbnail"
            />
            <ul className="flex m-0 pt-4 border-b-[#3F362B] border-b-[1px]">
                <li
                    className={classNames(
                        'ml-4 relative pb-2.5 cursor-pointer after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full',
                        { 'after:bg-[#f6a740]': activeTab == 0 },
                    )}
                    onClick={() => setActiveTab(0)}
                >
                    {type === Happenings.Event ? 'Event' : 'Run'} Info
                </li>
                <li
                    className={classNames(
                        'ml-4 relative pb-2.5 cursor-pointer after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full',
                        { 'after:bg-[#f6a740]': activeTab == 1 },
                    )}
                    onClick={() => setActiveTab(1)}
                >
                    {happening._count.interestedPlayers} interested
                </li>
                {type == Happenings.Run &&
                    happening.status == Status.Finished && (
                        <li
                            className={classNames(
                                'ml-4 relative pb-2.5 cursor-pointer after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full',
                                { 'after:bg-[#f6a740]': activeTab == 2 },
                            )}
                            onClick={() => setActiveTab(2)}
                        >
                            Reviews
                        </li>
                    )}
            </ul>
            <Carousel ref={ref} className="m-5" controls={false}>
                <div>
                    <StartTime
                        startAt={happening.startAt}
                        status={happening.status}
                    />
                    <p className="text-2xl font-semibold mt-4">
                        {type === Happenings.Event
                            ? (happening as Event).title
                            : happening.mapName}
                    </p>
                    <p className="text-medium-emphasis">
                        {happening.description}
                    </p>
                    <Place place={happening.place} />
                    <div className="flex mt-1">
                        <MapIcon color="var(--medium-emphasis)" />
                        <span className="ml-2.5 text-medium-emphasis font-medium text-sm">
                            {happening.mapName}
                        </span>
                    </div>
                    {type === Happenings.Run && (
                        <div className="flex mt-1">
                            <TeeIcon color="var(--medium-emphasis)" />
                            <span className="text-medium-emphasis ml-2.5 font-medium text-sm">
                                69/420
                            </span>
                        </div>
                    )}
                    <div className="text-medium-emphasis flex mt-2.5 items-center">
                        <Avatar
                            src={happening.author.avatar}
                            username={happening.author.username}
                        />
                        <span className="ml-2.5">
                            Created by {happening.author.username}
                        </span>
                    </div>
                </div>
                <div>
                    <ul>
                        {interestedPlayersSuccess &&
                            interestedPlayers?.status === 'success' &&
                            interestedPlayers?.data?.interestedPlayers.map(
                                (user, id) => (
                                    <InterestedPlayer
                                        key={id}
                                        // reviews={reviews?.data || []}
                                        authedUserId={authedUserId as number}
                                        happening={happening}
                                        onChange={inputCb}
                                        user={user}
                                        alreadyReviewed={
                                            reviews?.status === 'success' &&
                                            !!reviews?.data?.reviews.find(
                                                (review) =>
                                                    review.reviewedUser.id ===
                                                    user.user.id,
                                            )
                                        }
                                    />
                                ),
                            )}
                    </ul>
                </div>
                <div>
                    {reviews?.status === 'success' &&
                        reviews.data.reviews.map((review, id) => (
                            <Review key={id} review={review} />
                        ))}
                </div>
            </Carousel>
            <div
                className={
                    'flex justify-end rounded-b-[10px] py-4 px-5 bg-[#1A1714] text-primary-1'
                }
            >
                {isUserInTeam && happening.status == Status.Happening && (
                    <button
                        className={
                            'bg-[#383129] py-[8px] px-4 rounded-[5px] ml-2.5'
                        }
                        onClick={copyConnectData}
                    >
                        Copy IP
                    </button>
                )}
                <button
                    className={
                        'bg-[#383129] py-[8px] px-4 rounded-[5px] ml-2.5'
                    }
                >
                    Useless button
                </button>
            </div>
        </Modal>
    );
}
