import { SettingsIcon } from '@/components/ui/Icons/Settings';
import { Notification as NotificationT } from '@app/shared/types/Notification.type';
import { useAppSelector } from '@/utils/hooks/hooks';
import classNames from 'classnames';
import { Dispatch, forwardRef, Ref, SetStateAction } from 'react';
import { Notification } from './Notification';
import { useTranslation } from '@/i18/client';
import Link from 'next/link';

type OwnProps = {
    isVisible: boolean;
    setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export const Notifications = forwardRef(
    ({ isVisible, setIsVisible }: OwnProps, ref: Ref<HTMLDivElement>) => {
        const notifications = useAppSelector(
            (state) => state.user.user.notifications,
        );
        const { t } = useTranslation('notification');

        const onClick = () => {
            setIsVisible(false);
        };

        return (
            <div className="relative" data-id="notifications" ref={ref}>
                <div
                    className={classNames(
                        'absolute top-6 w-[450px] right-full bg-primary-3 text-high-emphasis z-[2] rounded-[10px]',
                        {
                            hidden: !isVisible,
                        },
                    )}
                >
                    <div className="flex justify-between px-[20px] pt-[10px] pb-[15px] border-b-high-emphasis border-b-[1px]">
                        <p>{t('title')}</p>
                        <Link onClick={onClick} href="/settings/notifications">
                            <SettingsIcon size={25} />
                        </Link>
                    </div>
                    <ul className="max-h-[350px] overflow-scroll pl-[20px] pr-[30px] mb-[20px]">
                        {notifications.map((notification, id) => (
                            <Notification
                                key={id}
                                notification={notification as NotificationT}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        );
    },
);
Notifications.displayName = 'Notifications';
