'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import classNames from 'classnames';
import { useAppSelector } from '@/utils/hooks/hooks';
import { useRef, useState } from 'react';
import { useGetCredentialsQuery } from '@/features/api/users.api';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import {
    CreateAndUpdateHappeningModal,
    ModalMode,
} from '../CreateAndUpdateHappeningModal';
import { Notifications } from './Notifications';
import { SearchIcon } from '../ui/Icons/Search';
import { useRouter } from 'next/navigation';
import { Profile } from './Profile';
import { AddIcon } from '../ui/Icons/Add';
import { NotificationIcon } from '../ui/Icons/Notification';
import { Happenings } from '@app/shared/types/Happening.type';
import { useTranslation } from '@/i18/client';
import { Dropdown, Item } from '../ui/Dropdown';

export function Header() {
    const ref = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const notificationRef = useRef<null | HTMLDivElement>(null);
    const isAuthed = useAppSelector((state) => state.user.isAuthed);
    const [currentHappening, setCurrentHappening] = useState<Happenings | null>(
        null,
    );
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { username } = useAppSelector((state) => state.user.user);
    const [isNotificationOverlayVisible, setIsNotificationOverlayVisible] =
        useState(false);
    const unreadNotificationsCount = useAppSelector(
        (state) => state.user.user._count.unreadNotifications,
    );
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('header');
    useGetCredentialsQuery();

    useOutsideClickHandler(
        notificationRef,
        isNotificationOverlayVisible,
        () => {
            setIsNotificationOverlayVisible(false);
        },
    );

    const onCreateHappeningModalClose = (cb: () => void) => {
        setCurrentHappening(null);
        setIsCreateModalVisible(false);
        cb();
    };

    const search = (e: any) => {
        e.preventDefault();
        if (ref && inputRef.current?.value) {
            router.push(
                `/search?query=${encodeURIComponent(
                    inputRef.current?.value || '',
                )}`,
            );
        }
    };

    const itemClassname =
        'text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3';
    const items: Item[] = [
        {
            key: '1',
            label: <div className={itemClassname}>{t('create_event')}</div>,
        },
        {
            key: '2',
            label: <div className={itemClassname}>{t('create_run')}</div>,
        },
    ];

    const handleMenuClick = (item: Item) => {
        setIsCreateModalVisible(true);
        setOpen(false);

        switch (item.key) {
            case '1':
                setCurrentHappening(Happenings.Event);
            case '2':
                setCurrentHappening(Happenings.Run);
                break;
        }
    };

    const handleOpenChange = () => {
        setOpen((prev) => !prev);
    };

    return (
        <header
            className={classNames('py-5 w-full z-[1] bg-[rgba(0,0,0,.36)]', {
                'absolute t-0': !isAuthed,
            })}
        >
            <CreateAndUpdateHappeningModal
                isVisible={isCreateModalVisible}
                onClose={onCreateHappeningModalClose}
                type={currentHappening as Happenings}
                mode={ModalMode.Create}
            />
            <div className="flex items-end max-w-[1110px] mx-auto">
                <Link href={'/'}>
                    <img
                        src="/logo.png"
                        alt="logotype"
                        className={classNames({ hidden: !isAuthed })}
                    />
                </Link>
                <div
                    className={classNames({
                        hidden: isAuthed,
                        'flex items-center ml-auto [&>:not(:first-child)]:ml-7':
                            !isAuthed,
                    })}
                >
                    <Button styleType="bordered">
                        <Link href="/register">
                            <img
                                src="/sign-up.png"
                                className="inline-block"
                                alt="sign up icon"
                            />{' '}
                            {t('register')}
                        </Link>
                    </Button>
                    <Button styleType="filled">
                        <Link href="/login">
                            <img
                                src="/login.png"
                                className="inline-block"
                                alt="login icon"
                            />{' '}
                            {t('login')}
                        </Link>
                    </Button>
                </div>
                <div
                    className={classNames({
                        'flex grow items-center': isAuthed,
                        hidden: !isAuthed,
                    })}
                >
                    <div className="flex grow justify-center">
                        <div className="relative">
                            <form onSubmit={search}>
                                <input
                                    ref={inputRef}
                                    placeholder="Deez nuts"
                                    className="rounded-full bg-primary-3 px-5 py-1 text-high-emphasis placeholder:text-low-emphasis"
                                />
                                <SearchIcon
                                    color="var(--high-emphasis)"
                                    className="absolute top-[50%] translate-y-[-50%] right-5"
                                />
                            </form>
                        </div>
                    </div>
                    {/* authed user part */}
                    <Dropdown
                        open={open}
                        menu={{ items, onClick: handleMenuClick }}
                        onOpenChange={handleOpenChange}
                    >
                        <Button
                            styleType={!open ? 'bordered' : 'filled'}
                            className={'p-[4px]'}
                        >
                            <AddIcon className="!m-0" color="#fff" />
                        </Button>
                    </Dropdown>
                    <Button
                        style={{ border: '0' }}
                        className="!p-0 max-w-[25px] w-full ml-5 relative"
                        styleType={'bordered'}
                    >
                        <div
                            onClick={() =>
                                setIsNotificationOverlayVisible(true)
                            }
                        >
                            <NotificationIcon color={'var(--high-emphasis)'} />
                        </div>
                        {unreadNotificationsCount !== null && (
                            <span
                                className={classNames(
                                    'absolute -top-[20%] left-[50%] bg-error text-[12px] rounded-full w-[90%]',
                                    { hidden: unreadNotificationsCount === 0 },
                                )}
                            >
                                {unreadNotificationsCount > 9
                                    ? '9+'
                                    : unreadNotificationsCount}
                            </span>
                        )}
                    </Button>
                    <Notifications
                        ref={notificationRef}
                        isVisible={isNotificationOverlayVisible}
                        setIsVisible={setIsNotificationOverlayVisible}
                    />
                    <p className="text-[white] mx-5">{username}</p>
                    <Profile />
                </div>
            </div>
        </header>
    );
}
