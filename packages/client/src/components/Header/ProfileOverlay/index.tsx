import { useLogoutMutation } from '@/features/api/users.api';
import { clearData } from '@/store/slices/user';
import { ExcludeSuccess } from '@/types/Response.type';
import { LogoutUserResponse } from '@app/shared/types/api.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MutableRefObject, Ref, forwardRef } from 'react';
import { useTranslation } from '@/i18/client';

const links = {
    '/profile': 'your_profile',
    '/happenings': 'your_happenings',
    '/settings/account': 'settings',
};

type OwnProps = {
    isHidden: boolean;
    ref: MutableRefObject<HTMLUListElement | null>;
};

export const ProfileOverlay = forwardRef(
    ({ isHidden }: OwnProps, ref: Ref<HTMLUListElement>) => {
        const [logoutUser] = useLogoutMutation();
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

        return (
            <ul
                data-id="profile-overlay"
                ref={ref}
                className={classNames(
                    'absolute w-[200px] right-0 top-full mt-3 rounded-[10px] bg-primary-3 px-5',
                    { hidden: isHidden },
                )}
            >
                {Object.keys(links).map((link, id) => (
                    <li
                        key={id}
                        className="mt-4 last-of-type:mb-4 text-medium-emphasis hover:!text-high-emphasis"
                    >
                        <Link href={link}>
                            {t(links[link as keyof typeof links])}
                        </Link>
                    </li>
                ))}
                {/*NOTE: make it visible only for certain users? */}
                <li className="mt-4 last-of-type:mb-4 text-medium-emphasis hover:!text-high-emphasis cursor-pointer">
                    <Link href="/admin">Link for big bois</Link>
                </li>
                <li
                    className="mt-4 last-of-type:mb-4 text-medium-emphasis hover:!text-high-emphasis cursor-pointer"
                    onClick={logout}
                >
                    {t('sign_out')}
                </li>
            </ul>
        );
    },
);
ProfileOverlay.displayName = 'ProfileOverlay';
