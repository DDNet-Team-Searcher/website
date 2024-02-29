import { Avatar } from '@/components/Avatar';
import { useLazySetNotificationSeenQuery } from '@/features/api/notifications.api';
import {
    Notification as NotificationT,
    NotificationType,
} from '@app/shared/types/Notification.type';
import { timeAgo } from '@/utils/timeago';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useTranslation } from '@/i18/client';
import { ReactNode } from 'react';

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

    let node: ReactNode;

    switch (notification.type) {
        case NotificationType.InterestedInHappening:
            node = (
                <p>
                    {t('interested', {
                        username:
                            notification.user.username || 'Deleted account',
                    })}{' '}
                    <Link
                        href={`?happeningId=${notification.notification.happeningId}`}
                        className="underline"
                    >
                        {t('interested_link')}
                    </Link>
                </p>
            );
            break;
        case NotificationType.Follow:
            node = (
                <p>
                    {t('follow', {
                        username:
                            notification.user.username || 'Deleted account',
                    })}
                </p>
            );
            break;
        case NotificationType.Unfollow:
            node = (
                <p>
                    {t('unfollow', {
                        username:
                            notification.user.username || 'Deleted account',
                    })}
                </p>
            );
            break;
        case NotificationType.AddedInTeam:
            node = (
                <p>
                    {t('added', {
                        username:
                            notification.user.username || 'Deleted account',
                    })}{' '}
                    <Link
                        href={`?happeningId=${notification.notification.happeningId}`}
                        className="underline"
                    >
                        {t('added_link')}
                    </Link>
                </p>
            );
            break;
        case NotificationType.RemovedFromTeam:
            node = (
                <p>
                    {t('removed', {
                        username:
                            notification.user.username || 'Deleted account',
                    })}{' '}
                    <Link
                        href={`?happeningId=${notification.notification.happeningId}`}
                        className="underline"
                    >
                        {t('removed_link')}
                    </Link>
                </p>
            );
            break;
        case NotificationType.NoEmptyServers:
            node = <p>{t('no_empty_servers')}</p>;
            break;
    }

    return (
        <li className="mt-[15px] flex" ref={ref}>
            {notification.type !== NotificationType.NoEmptyServers && (
                <Link href={`/profile/${notification.user.id}`}>
                    <Avatar
                        src={notification.user.avatar}
                        username={
                            notification.user?.username || 'Deleted Account'
                        }
                        size={30}
                        className="mt-[5px]"
                    />
                </Link>
            )}
            <div className="ml-[10px]">
                {node}
                <span className="text-[12px] text-medium-emphasis align-top">
                    {timeAgo.format(new Date(notification.createdAt!))}
                </span>
            </div>
        </li>
    );
}
