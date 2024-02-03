import { SettingsIcon } from '@/components/ui/Icons/Settings';
import { Notification as NotificationT } from '@app/shared/types/Notification.type';
import { useAppSelector } from '@/utils/hooks/hooks';
import classNames from 'classnames';
import { forwardRef, Ref } from 'react';
import { Notification } from './Notification';

type OwnProps = {
    isVisible: boolean;
};

//NOTE: do smth with it? XD
/* eslint-disable react/display-name */
export const Notifications = forwardRef(
    ({ isVisible }: OwnProps, ref: Ref<HTMLDivElement>) => {
        const notifications = useAppSelector(
            (state) => state.user.user.notifications,
        );

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
                        <p>Notifications</p>
                        <SettingsIcon size={25} />
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
