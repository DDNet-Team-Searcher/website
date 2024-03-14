import { useLogoutMutation } from '@/features/api/users.api';
import { clearData } from '@/store/slices/user';
import { ExcludeSuccess } from '@/types/Response.type';
import { LogoutUserResponse } from '@app/shared/types/api.type';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/i18/client';
import { Role } from '@app/shared/types/Role.type';
import { Dropdown, Item } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/Avatar';

export function Profile() {
    const [open, setOpen] = useState(false);
    const [logoutUser] = useLogoutMutation();
    const role = useAppSelector((state) => state.user.user.role);
    const { username, avatar } = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    const handleFormError = useHandleFormError();
    const router = useRouter();
    const { t } = useTranslation('header');

    const logout = async () => {
        try {
            await logoutUser().unwrap();

            dispatch(clearData());

            router.push('/');
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<LogoutUserResponse>;

            handleFormError(error);
        }
    };

    const itemClassname =
        'block px-5 py-2 text-medium-emphasis hover:!text-high-emphasis';
    const items: Item[] = [
        {
            key: '1',
            label: (
                <Link className={itemClassname} href="/profile">
                    {t('your_profile')}
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link className={itemClassname} href="/settings/account">
                    {t('settings')}
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link
                    className={classNames(itemClassname, {
                        hidden: !(role === Role.Admin || role === Role.Mod),
                    })}
                    href="/admin"
                >
                    Link for big bois
                </Link>
            ),
        },
        {
            key: '4',
            label: (
                <span className={classNames(itemClassname, 'cursor-pointer')}>
                    {t('sign_out')}
                </span>
            ),
        },
    ];

    const handleMenuClick = (item: Item) => {
        setOpen(false);

        if (item.key === '4') {
            logout();
        }
    };

    const handleOpenChange = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Dropdown
            open={open}
            menu={{ items, onClick: handleMenuClick }}
            onOpenChange={handleOpenChange}
        >
            <Avatar
                className="cursor-pointer"
                src={avatar}
                username={username || ''}
                size={30}
            />
        </Dropdown>
    );
}
