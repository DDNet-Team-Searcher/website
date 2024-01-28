'use client';

import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Avatar } from '@/components/Avatar';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import {
    useFollowUserMutation,
    useLazyGetProfileQuery,
    useUnbanUserMutation,
} from '@/features/api/users.api';
import { Graph } from '@/components/Graph';
import { PeopleIcon } from '@/components/ui/Icons/People';
import { ClockIcon } from '@/components/ui/Icons/Clock';
import { getUserFavoriteServer } from '@/store/slices/user';
import { timeAgo } from '@/utils/timeago';
import { Button } from '@/components/ui/Button';
import {
    deleteHappening,
    setHappeningStatus,
    setIsInterestedInHappening,
    setProfile,
} from '@/store/slices/profile';
import {
    Event as EventType,
    Happenings,
    Run,
    Run as RunType,
} from '@app/shared/types/Happening.type';
import { ReportModal } from './ReportModal';
import { BanModal } from './BanModal';
import { hint } from '@/store/slices/hints';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { ExcludeSuccess } from '@/types/Response.type';
import { BanUserResponse } from '@app/shared/types/api.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Role } from '@app/shared/types/Role.type';
import { Happening } from '@/components/Happening';

type OwnProps = {
    params: {
        slug?: string[];
    };
};

const roles = {
    Admin: {
        icon: 'https://cdn.7tv.app/emote/60ae958e229664e8667aea38/4x.webp',
        color: '#f6a740',
    },
    Mod: {
        icon: 'https://cdn.7tv.app/emote/6134bc74f67d73ea27e44b0f/4x.webp',
        color: '#3498db',
    },
    Verified: {
        icon: 'https://cdn.7tv.app/emote/6268904f4f54759b7184fa72/4x.webp',
        color: '#ffffff',
    },
};

export default function Profile({ params: { slug } }: OwnProps) {
    const dispatch = useAppDispatch();
    const [fetchProfile] = useLazyGetProfileQuery();
    const [followUser] = useFollowUserMutation();
    const profile = useAppSelector((state) => state.profile);
    const authedUserId = useAppSelector((state) => state.user.user.id);
    const userRole = useAppSelector((state) => state.user.user.role);
    const id = slug ? slug[0] : authedUserId?.toString()!;
    const sameUser = authedUserId === parseInt(id);
    const [favServer, setFavServer] = useState('');
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isBanModalVisible, setIsBanModalVisible] = useState(false);
    const [unbanUser] = useUnbanUserMutation();
    const handleFormError = useHandleFormError();

    useEffect(() => {
        dispatch(getUserFavoriteServer(profile?.username || '')).then((res) =>
            setFavServer(res || ''),
        );
    }, [profile]);

    const refetchUserProfile = () => {
        if (id) {
            try {
                fetchProfile(parseInt(id as string)).then((res) => {
                    if (res.data?.status === 'success') {
                        dispatch(setProfile(res.data.data.profile));
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        refetchUserProfile();
    }, [id]);

    const startDateWithWeekday = new Date(
        profile.createdAt || '',
    ).toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const follow = async () => {
        try {
            if (profile.id) {
                await followUser(profile.id);
                refetchUserProfile();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const openReportModal = () => {
        setIsReportModalVisible(true);
    };

    const onReportModalClose = () => {
        setIsReportModalVisible(false);
    };

    const openBanModal = () => {
        setIsBanModalVisible(true);
    };

    const onBanModalClose = () => {
        setIsBanModalVisible(false);
    };

    const unban = async () => {
        try {
            const response = await unbanUser({
                userId: parseInt(id),
            }).unwrap();

            if (response.status === 'success') {
                dispatch(
                    hint({ type: 'success', text: response.message || '' }),
                );
            }
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<BanUserResponse>;

            handleFormError(error);
        }
    };

    return (
        <>
            <ReportModal
                visible={isReportModalVisible}
                onClose={onReportModalClose}
                userId={parseInt(id)}
            />
            <BanModal
                visible={isBanModalVisible}
                onClose={onBanModalClose}
                userId={parseInt(id)}
            />
            {!profile && (
                <p className="text-center text-high-emphasis text-[5rem]">
                    User not found :&lt;
                </p>
            )}
            {profile && (
                <div className="mt-[85px] max-w-[1110px] w-full mx-auto">
                    <div className="flex justify-center">
                        <Avatar
                            size={285}
                            src={profile.avatar}
                            username={profile.username || ''}
                        />
                        <div className="text-high-emphasis ml-[65px]">
                            <p className="text-2xl mt-9">{profile.username}</p>
                            <div className="flex flex-wrap">
                                {Object.keys(roles)
                                    .filter((role) => role == profile.role)
                                    .map((role) => (
                                        <div
                                            className="mr-3 mt-2 p-1.5 rounded-[5px] flex items-center"
                                            style={{
                                                backgroundColor: `${
                                                    roles[
                                                        role as keyof typeof roles
                                                    ].color
                                                }1A`,
                                                border: `1px solid ${
                                                    roles[
                                                        role as keyof typeof roles
                                                    ].color
                                                }`,
                                            }}
                                        >
                                            <img
                                                className="w-5 h-5 mr-2 inline-block"
                                                src={
                                                    roles[
                                                        role as keyof typeof roles
                                                    ].icon
                                                }
                                                alt="Role image"
                                            />
                                            <span>{role}</span>
                                        </div>
                                    ))}
                            </div>
                            <p className="mt-1">
                                <PeopleIcon
                                    color="#fff"
                                    className="inline-block"
                                />{' '}
                                <span>
                                    {profile._count.followers} followers ·{' '}
                                    {profile._count.following} following
                                </span>
                            </p>
                            <p className="mt-1">
                                <ClockIcon
                                    color="#fff"
                                    className="inline-block"
                                />{' '}
                                <span>Joined {startDateWithWeekday}</span>
                            </p>
                            <p className="mt-1">
                                Clan{' '}
                                <span className="text-sm opacity-30 ml-[20px]">
                                    namelessclan
                                </span>
                            </p>
                            <div
                                className={classNames('flex mt-5', {
                                    hidden: sameUser,
                                })}
                            >
                                <Button
                                    className="max-w-[120px] w-full !block text-center"
                                    onClick={follow}
                                    styleType={'filled'}
                                >
                                    {profile.isFollowing
                                        ? 'Unfollow'
                                        : 'Follow'}
                                </Button>
                                {userRole == Role.Admin ||
                                userRole == Role.Mod ? (
                                    profile.isBanned ? (
                                        <Button
                                            className="max-w-[120px] ml-3 w-full !block text-center !border-error"
                                            styleType={'bordered'}
                                            onClick={unban}
                                        >
                                            Unban
                                        </Button>
                                    ) : (
                                        <Button
                                            className="max-w-[120px] ml-3 w-full !block text-center !border-error"
                                            styleType={'bordered'}
                                            onClick={openBanModal}
                                        >
                                            Ban
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        className="max-w-[120px] ml-3 w-full !block text-center !border-error"
                                        onClick={openReportModal}
                                        styleType={'bordered'}
                                        disabled={profile.isReported || false}
                                    >
                                        {profile.isReported
                                            ? 'Reported'
                                            : 'Report'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    <ul className="flex justify-between mt-[100px]">
                        <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-high-emphasis text-center w-full py-9 px-[85px]">
                            <p className="text-2xl">
                                {favServer || "Coudn't find fav server"}
                            </p>
                            <p className="opacity-[.87]">most played server</p>
                        </li>
                        <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-high-emphasis text-center w-full py-9 px-[85px]">
                            <p className="text-2xl">
                                {profile._count.playedEvents}
                            </p>
                            <p className="opacity-[.87]">events hosted</p>
                        </li>
                        <li className="max-w-[30%] border-[1px] border-primary-1 bg-primary-2 transition-colors hover:bg-primary-3 rounded-[20px] text-high-emphasis text-center w-full py-9 px-[85px]">
                            <p className="text-2xl">
                                {profile._count.playedRuns}
                            </p>
                            <p className="opacity-[.87]">runs finished</p>
                        </li>
                    </ul>
                    <section className="mt-[60px]">
                        <h2 className="text-3xl text-high-emphasis text-center">
                            {profile.username}&apos;s last events
                        </h2>
                        <div className="w-full flex justify-around flex-wrap">
                            {profile.happenings.events.map((event, id) => (
                                <Happening
                                    {
                                        ...{} /*className="mt-5"*/
                                    }
                                    id={event.id!}
                                    key={id}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="mt-[60px]">
                        <h2 className="text-3xl text-high-emphasis text-center">
                            {profile.username}&apos;s last runs
                        </h2>
                        <div className="max-w-[80%] w-full mx-auto flex flex-wrap justify-around">
                            {profile.happenings.runs.map((run, id) => (
                                <Happening
                                    {
                                        ...{} /*className="mt-5"*/
                                    }
                                    id={run.id!}
                                    key={id}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="max-w-[80%] mx-auto w-full mt-[60px]">
                        <Graph username={profile.username || ''} />
                    </section>
                    <section className="mt-[60px] mb-[200px]">
                        <h2 className="text-3xl text-high-emphasis text-center">
                            What people say about {profile.username}
                        </h2>
                        <div>
                            {profile.reviews.map(
                                (
                                    {
                                        review,
                                        rate,
                                        createdAt,
                                        author: { avatar, username },
                                    },
                                    id,
                                ) => (
                                    <div
                                        className="flex mt-12 max-w-[600px] w-full mx-auto"
                                        key={id}
                                    >
                                        <div>
                                            <Avatar
                                                size={50}
                                                username={username || ''}
                                                src={avatar}
                                            />
                                        </div>
                                        <div className="ml-1">
                                            <p className="font-semibold text-high-emphasis">
                                                {username}
                                            </p>
                                            <div className="flex items-center">
                                                <div className="flex -ml-1">
                                                    {rate &&
                                                        new Array(rate)
                                                            .fill(rate)
                                                            .map((_, id) => (
                                                                <img
                                                                    className="max-w-7 h-7 [&:not(:first-child)]:-ml-3"
                                                                    src="/default-tee.png"
                                                                    key={id}
                                                                />
                                                            ))}
                                                </div>
                                                <span className="text-xs text-medium-emphasis ml-1">
                                                    {timeAgo.format(
                                                        new Date(
                                                            createdAt || '',
                                                        ),
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-high-emphasis mt-2.5">
                                                {review}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
