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

    let text = '';

    switch (notification.type) {
        case NotificationType.InterestedInHappening:
            let interestedUsername =
                notification.author.username || 'deleted user';

            if (notification.happening.type == Happenings.Run) {
                text = t('interested_run', {
                    interestedUsername,
                    mapName: notification.happening.mapName,
                });
            } else if (notification.happening.type == Happenings.Event) {
                text = t('interested_event', {
                    interestedUsername,
                    title: notification.happening.title,
                });
            }

            break;
        case NotificationType.Follow:
            text = t('follow', {
                username: notification.author.username
            });

            break;
        case NotificationType.Unfollow:
            text = t('unfollow', {
                username: notification.author.username
            });

            break;
        case NotificationType.NoEmptyServers:
            text = t('no_empty_servers');

            break;
    }

    return (
        <li className="mt-[15px] flex" ref={ref}>
            {notification.type === NotificationType.InterestedInHappening && (
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
