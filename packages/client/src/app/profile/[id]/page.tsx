'use client';

import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Avatar } from '@/components/Avatar';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Run } from '@/components/Happening/Run';
import { Event } from '@/components/Happening/Event';
import {
    useFollowUserMutation,
    useLazyGetProfileQuery,
} from '@/features/api/users.api';
import { VerifiedIcon } from '@/components/ui/Icons/Verified';
import { Graph } from '@/components/Graph';
import { PeopleIcon } from '@/components/ui/Icons/People';
import { ClockIcon } from '@/components/ui/Icons/Clock';
import { getUserFavoriteServer } from '@/store/slices/user';
import { timeAgo } from '@/utils/timeago';
import { Button } from '@/components/ui/Button';
import { deleteHappening, setHappeningStatus, setIsInterestedInHappening, setProfile } from '@/store/slices/profile';
import { Event as EventType, Run as RunType } from '@app/shared/types/Happening.type';

type OwnProps = {
    params: {
        id: string;
    };
};

export default function Profile({ params: { id } }: OwnProps) {
    const dispatch = useAppDispatch();
    const [fetchProfile] = useLazyGetProfileQuery();
    const [followUser] = useFollowUserMutation();
    const profile = useAppSelector(state => state.profile);
    const authedUserId = useAppSelector((state) => state.user.user.id);
    const sameUser = authedUserId === parseInt(id as string);
    const [favServer, setFavServer] = useState('');

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
                followUser(profile.id);
                refetchUserProfile();
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            {!profile && (
                <p className="text-center text-high-emphasis text-[5rem]">
                    User not found :&lt;
                </p>
            )}
            {profile && (
                <div className="mt-[85px] max-w-[1110px] mx-auto">
                    <div className="flex justify-center">
                        <Avatar
                            size={285}
                            src={profile.avatar}
                            username={profile.username || ''}
                        />
                        <div className="text-high-emphasis ml-[65px]">
                            <p className="text-2xl mt-9">
                                {profile.username}{' '}
                                {profile.verified && (
                                    <VerifiedIcon
                                        className="inline-block"
                                        color="blue"
                                    />
                                )}
                            </p>
                            <div className="flex flex-wrap">
                                {profile.roles &&
                                    profile.roles.map((role, id) => (
                                        <div
                                            className="mr-3 mt-2 p-1.5 rounded-[5px]"
                                            style={{
                                                backgroundColor: `${role.color}1A`,
                                                border: `1px solid ${role.color}`,
                                            }}
                                            key={id}
                                        >
                                            {role.url && (
                                                <img
                                                    className="w-4 h-4 mr-2.5 inline-block"
                                                    src={role.url}
                                                    alt="Role image"
                                                />
                                            )}
                                            <span>{role.name}</span>
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
                            {profile.username}'s last events
                        </h2>
                        <div className="w-full flex justify-around flex-wrap">
                            {profile.happenings.events.map((event, id) => (
                                <Event
                                    className="mt-5"
                                    event={event as EventType}
                                    key={id}
                                    setStatusDispatch={setHappeningStatus}
                                    deleteDispatch={deleteHappening}
                                    setIsInterestedDispatch={setIsInterestedInHappening}
                                />
                            ))}
                        </div>
                    </section>
                    <section className="mt-[60px]">
                        <h2 className="text-3xl text-high-emphasis text-center">
                            {profile.username}'s last runs
                        </h2>
                        <div className="max-w-[80%] w-full mx-auto flex flex-wrap justify-around">
                            {profile.happenings.runs.map((run, id) => (
                                <Run
                                    className="mt-5"
                                    run={run as RunType}
                                    key={id}
                                    setStatusDispatch={setHappeningStatus}
                                    deleteDispatch={deleteHappening}
                                    setIsInterestedDispatch={setIsInterestedInHappening}
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
                                                        new Date(createdAt || ''),
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
