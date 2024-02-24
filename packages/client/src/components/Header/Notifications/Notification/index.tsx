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
import { useTranslation } from '@/i18/client';

type OwnProps = {
    notification: NotificationT;
};

export function Notification({ notification }: OwnProps) {
    const { t } = useTranslation('notification');
    const [setNotificationSeen] = useLazySetNotificationSeenQuery();
    const { ref } = useInView({
        onChange: (inView) => {
            if (inView && !notification.seen) {
                setNotificationSeen(notification.id);
            }
        },
    });

    let text: string;

    switch (notification.type) {
        case NotificationType.InterestedInHappening:
            text = t('interested', {
                username: notification.user.username,
            });
            break;
        case NotificationType.Follow:
            text = t('follow', {
                username: notification.user.username,
            });
            break;
        case NotificationType.Unfollow:
            text = t('unfollow', {
                username: notification.user.username,
            });
            break;
        case NotificationType.AddedInTeam:
            text = t('added', {
                username: notification.user.username,
            });
            break;
        case NotificationType.RemovedFromTeam:
            text = t('removed', {
                username: notification.user.username,
            });
            break;
        case NotificationType.NoEmptyServers:
            text = t('no_empty_servers');
            break;
    }

    return (
        <li className="mt-[15px] flex" ref={ref}>
            {notification.type !== NotificationType.NoEmptyServers && (
                <Link href={`/profile/${notification.user.id}`}>
                    <Avatar
                        src={notification.user.avatar}
                        username={notification.user.username}
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
