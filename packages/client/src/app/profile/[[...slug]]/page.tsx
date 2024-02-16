'use client';

import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { Avatar } from '@/components/Avatar';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
    useFollowUserMutation,
    useGetProfileQuery,
    useUnbanUserMutation,
} from '@/features/api/users.api';
import { PeopleIcon } from '@/components/ui/Icons/People';
import { ClockIcon } from '@/components/ui/Icons/Clock';
import { getUserFavoriteServer } from '@/store/slices/user';
import { Button } from '@/components/ui/Button';
import { ReportModal } from './ReportModal';
import { BanModal } from './BanModal';
import { hint } from '@/store/slices/hints';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { ExcludeSuccess } from '@/types/Response.type';
import { BanUserResponse } from '@app/shared/types/api.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Role } from '@app/shared/types/Role.type';
import { Carousel, CarouselRef } from '@/components/ui/Carousel';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Profile } from '@app/shared/types/Profile.type';
import { Reviews } from './Reviews';
import { Happenings } from './Happenings';
import { Stats } from './Stats';
import { useTranslation } from '@/i18/client';

const roles = {
    Admin: {
        icon: '/roles/admin.webp',
        color: '#f6a740',
    },
    Mod: {
        icon: '/roles/moderator.webp',
        color: '#3498db',
    },
    Verified: {
        icon: '/roles/verified.webp',
        color: '#ffffff',
    },
};

const tabs = ['happenings', 'stats', 'reviews'];

type OwnProps = {
    params: {
        slug?: string[];
    };
};

export default function Profile({ params: { slug } }: OwnProps) {
    const authedUserId = useAppSelector((state) => state.user.user.id);
    const id = slug ? parseInt(slug[0]) : authedUserId!;
    const dispatch = useAppDispatch();
    const { data, isSuccess, refetch } = useGetProfileQuery(id);
    const [profile, setProfile] = useState<null | Profile>(null);
    const [followUser] = useFollowUserMutation();
    const userRole = useAppSelector((state) => state.user.user.role);
    const sameUser = authedUserId === id;
    const [favServer, setFavServer] = useState('');
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isBanModalVisible, setIsBanModalVisible] = useState(false);
    const [unbanUser] = useUnbanUserMutation();
    const handleFormError = useHandleFormError();
    const router = useRouter();
    const ref = useRef<CarouselRef | null>(null);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<number>(0);
    const { t } = useTranslation('profile');

    useEffect(() => {
        let tab = searchParams.get('tab');
        if (tab && tabs.includes(tab)) {
            setActiveTab(tabs.indexOf(tab));
        }
    }, []);

    useEffect(() => {
        ref.current?.goTo(activeTab);
    }, [ref.current]);

    useEffect(() => {
        if (data?.status === 'success') {
            setProfile(data.data.profile);
        }
    }, [data, isSuccess]);

    useEffect(() => {
        ref.current?.goTo(activeTab);
    }, [activeTab]);

    useEffect(() => {
        dispatch(getUserFavoriteServer(profile?.username || '')).then((res) =>
            setFavServer(res || ''),
        );
    }, [profile]);

    const startDateWithWeekday = new Date(
        profile?.createdAt || '',
    ).toLocaleDateString([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const follow = async () => {
        try {
            if (profile?.id) {
                await followUser(profile.id);
                refetch();
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
                userId: id,
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

    const switchTab = (tabName: string) => {
        router.push(`?tab=${tabName}`, { scroll: false });
        setActiveTab(tabs.indexOf(tabName));
    };

    return (
        <>
            <ReportModal
                visible={isReportModalVisible}
                onClose={onReportModalClose}
                userId={id}
            />
            <BanModal
                visible={isBanModalVisible}
                onClose={onBanModalClose}
                userId={id}
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
                                    .map((role, id) => (
                                        <div
                                            key={id}
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
                            <p className="mt-1 flex">
                                Favorite server
                                <img
                                    className="max-w-[30px] object-contain ml-1"
                                    src={`/countryflags/${
                                        favServer || 'UNK'
                                    }.png`}
                                />
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
                    <ul className="flex [&>:not(&>:first-child)]:ml-5">
                        {tabs.map((tab, id) => (
                            <li
                                key={tab}
                                onClick={() => switchTab(tab)}
                                className={classNames(
                                    'capitalize relative cursor-pointer hover:text-high-emphasis after:transition-all after:absolute after:w-full after:h-[2px] after:left-0 after:bottom-[-1px] after:rounded-full',
                                    {
                                        'after:bg-[#f6a740] text-high-emphasis':
                                            id === activeTab,
                                        'text-medium-emphasis':
                                            id !== activeTab,
                                    },
                                )}
                            >
                                {tab}
                            </li>
                        ))}
                    </ul>
                    <Carousel ref={ref} className="my-10" controls={false}>
                        <Happenings userId={id} />
                        <Stats username={profile.username} />
                        <Reviews userId={id} />
                    </Carousel>
                </div>
            )}
        </>
    );
}
