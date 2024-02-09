import { Avatar } from '@/components/Avatar';
import { useGetProfileReviewsQuery } from '@/features/api/users.api';
import { ProfileReview } from '@app/shared/types/Review.type';
import { timeAgo } from '@/utils/timeago';
import { useEffect, useState } from 'react';

type OwnProps = {
    userId: number;
};

export function Reviews({ userId }: OwnProps) {
    const { data, isLoading } = useGetProfileReviewsQuery(userId);
    const [reviews, setReviews] = useState<ProfileReview[] | null>(null);

    useEffect(() => {
        if (data?.status === 'success') {
            setReviews(data.data.reviews);
        }
    }, [isLoading]);

    return (
        <section>
            {reviews &&
                reviews.map(
                    ({
                        id,
                        rate,
                        review,
                        createdAt,
                        author: { username, avatar },
                    }) => (
                        <div
                            className="flex mt-12 max-w-[600px] w-full mx-auto"
                            key={id}
                        >
                            <div>
                                <Avatar
                                    size={50}
                                    username={username || ''}
                                    src={avatar}
                                />
                            </div>
                            <div className="ml-1">
                                <p className="font-semibold text-high-emphasis">
                                    {username}
                                </p>
                                <div className="flex items-center">
                                    <div className="flex -ml-1">
                                        {rate &&
                                            new Array(rate)
                                                .fill(rate)
                                                .map((_, id) => (
                                                    <img
                                                        className="max-w-7 h-7 [&:not(:first-child)]:-ml-3"
                                                        src="/default-tee.png"
                                                        key={id}
                                                    />
                                                ))}
                                    </div>
                                    <span className="text-xs text-medium-emphasis ml-1">
                                        {timeAgo.format(
                                            new Date(createdAt || ''),
                                        )}
                                    </span>
                                </div>
                                <p className="text-high-emphasis mt-2.5">
                                    {review}
                                </p>
                            </div>
                        </div>
                    ),
                )}
        </section>
    );
}
