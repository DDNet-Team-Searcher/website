'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import classNames from 'classnames';
import { useAppSelector } from '@/utils/hooks/hooks';
import { useRef, useState } from 'react';
import { useGetCredentialsQuery } from '@/features/api/users.api';
import { Avatar } from '../Avatar';
import { useOutsideClickHandler } from '@/utils/hooks/useClickedOutside';
import {
    setIsCreateEventModalHidden,
    setIsCreateRunModalHidden,
} from '@/store/slices/app';
import { CreateAndUpdateHappeningModal, ModalMode } from '../CreateAndUpdateHappeningModal';
import { Notifications } from './Notifications';
import { SearchIcon } from '../ui/Icons/Search';
import { useRouter } from 'next/navigation';
import { ProfileOverlay } from './ProfileOverlay';

export function Header() {
    const ref = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const notificationRef = useRef<null | HTMLDivElement>(null);
    const [isCreateSelectionMenuHidden, setIsSelectionMenuHidden] =
        useState(true);
    const profileOverlayRef = useRef<null | HTMLUListElement>(null);
    const [isProfileOverlayHidden, setIsProfileOverlayHidden] = useState(true);
    const isAuthed = useAppSelector((state) => state.user.isAuthed);
    const [currentHappening, setCurrentHappening] = useState<
        'run' | 'event' | null
    >(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { username, avatar } = useAppSelector((state) => state.user.user);
    const [isNotificationOverlayVisible, setIsNotificationOverlayVisible] =
        useState(false);
    useGetCredentialsQuery();
    const unreadNotificationsCount = useAppSelector(
        (state) => state.user.user._count.unreadNotifications,
    );
    const router = useRouter();

    const onOutsideClick = () => {
        setIsSelectionMenuHidden(true);
    };

    useOutsideClickHandler(ref, !isCreateSelectionMenuHidden, onOutsideClick);
    useOutsideClickHandler(
        notificationRef,
        isNotificationOverlayVisible,
        () => {
            setIsNotificationOverlayVisible(false);
        },
    );
    useOutsideClickHandler(
        profileOverlayRef,
        !isProfileOverlayHidden,
        () => {
            setIsProfileOverlayHidden(true);
        },
    );

    const openProfileOverlay = () => {
        setIsProfileOverlayHidden(false);
    }

    const createRun = () => {
        setCurrentHappening('run');
        setIsCreateModalVisible(true);
        // setIsSelectionMenuHidden(true);
        // dispatch(setIsCreateRunModalHidden(false))
    };

    const createEvent = () => {
        setCurrentHappening('event');
        setIsCreateModalVisible(true);
        // setIsSelectionMenuHidden(true);
        // dispatch(setIsCreateEventModalHidden(false))
    };

    const onCreateHappeningModalClose = (cb: () => void) => {
        setCurrentHappening(null);
        setIsCreateModalVisible(false);
        cb();
    };

    const search = (e: any) => {
        e.preventDefault();
        if (ref && inputRef.current?.value) {
            router.push(`/search?query=${encodeURIComponent(inputRef.current?.value || "")}`);
        }
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
                type={currentHappening as 'run' | 'event'}
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
                            Sign up
                        </Link>
                    </Button>
                    <Button styleType="filled">
                        <Link href="/login">
                            <img
                                src="/login.png"
                                className="inline-block"
                                alt="login icon"
                            />{' '}
                            Log in
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
                    <div className="relative ml-auto">
                        <Button
                            styleType={
                                isCreateSelectionMenuHidden
                                    ? 'bordered'
                                    : 'filled'
                            }
                            className={'p-[4px]'}
                            onClick={() =>
                                setIsSelectionMenuHidden(
                                    !isCreateSelectionMenuHidden,
                                )
                            }
                        >
                            <img className="!m-0" src={'/add.svg'} alt="add icon" />
                        </Button>
                        <div
                            ref={ref}
                            data-id="header"
                            className={classNames(
                                'absolute l-0 z-[1] min-w-[max(100%,200px)] bg-primary-2 top-[125%] rounded-[10px]',
                                { hidden: isCreateSelectionMenuHidden },
                            )}
                        >
                            <div
                                className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3"
                                onClick={createEvent}
                            >
                                Create event
                            </div>
                            <div
                                className="text-[white] px-4 py-2.5 rounded-[10px] transition-all duration-200 cursor-pointer hover:bg-primary-3"
                                onClick={createRun}
                            >
                                Create run
                            </div>
                        </div>
                    </div>
                    <Button
                        style={{ border: '0' }}
                        className="!p-0 max-w-[25px] w-full ml-5 relative"
                        styleType={'bordered'}
                    >
                        <img
                            onClick={() =>
                                setIsNotificationOverlayVisible(true)
                            }
                            src="/notification.svg"
                            alt="notification icon"
                        />
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
                    />
                    <p className="text-[white] mx-5">{username}</p>
                    <div className="relative">
                        <Avatar className="cursor-pointer" onClick={openProfileOverlay} src={avatar} username={username || ''} size={30} />
                        <ProfileOverlay ref={profileOverlayRef} isHidden={isProfileOverlayHidden} />
                    </div>
                </div>
            </div>
        </header>
    );
}
