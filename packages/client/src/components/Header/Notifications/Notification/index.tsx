import { Avatar } from '@/components/Avatar';
import { useLazySetNotificationSeenQuery } from '@/features/api/notifications.api';
import { Happenings } from '@app/shared/types/Happening.type';
import {
    Notification as NotificationT,
    NotificationType,
} from '@app/shared/types/Notification.type';
import { timeAgo } from '@/utils/timeago';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useLingui } from '@lingui/react';

type OwnProps = {
    notification: NotificationT;
};

export function Notification({ notification }: OwnProps) {
    const { i18n } = useLingui();
    const [setNotificationSeen] = useLazySetNotificationSeenQuery();
    const { ref } = useInView({
        onChange: (inView) => {
            if (inView && !notification.seen) {
                setNotificationSeen(notification.id);
            }
        },
    });

    let text = '';

    if (notification.type == NotificationType.InterestedInHappening) {
        let interestedUsername = notification.author.username || 'deleted user';

        if (notification.happening.type == Happenings.Run) {
            text = i18n._('notification.interested_run', {
                interestedUsername,
                mapName: notification.happening.mapName,
            });
        } else if (notification.happening.type == Happenings.Event) {
            text = i18n._('notification.interested_event', {
                interestedUsername,
                title: notification.happening.title,
            });
        }
    } else if (notification.type === NotificationType.NoEmptyServers) {
        text = i18n._('notification.no_empty_servers');
    }
    //TODO: add other types of notifications

    return (
        <li className="mt-[15px] flex" ref={ref}>
            {notification.type === NotificationType.InterestedInHappening && (
                //@ts-ignore
                <Link href={`/profile/${notification.notification.userId}`}>
                    <Avatar
                        src={notification.author.avatar}
                        username={notification.author.username}
                        size={30}
                        className="mt-[5px]"
                    />
                </Link>
            )}
            <div className="ml-[10px]">
                <p className="align-top">{text}</p>
                <span className="text-[12px] text-medium-emphasis align-top">
                    {timeAgo.format(new Date(notification.createdAt!))}
                </span>
            </div>
        </li>
    );
}
