import { Review as ReviewT } from '@app/shared/types/Review.type';
import Link from 'next/link';
import { timeAgo } from '@/utils/timeago';

type OwnProps = {
    review: ReviewT;
};

export function Review({
    review: { createdAt, author, rate, reviewedUser, review },
}: OwnProps) {
    return (
        <div className=" rounded-[10px] bg-primary-3 pt-2.5 [&:not(:first-child)]:mt-2.5">
            <div className="flex items-center px-2.5">
                <div className="px-2.5">
                    <p>
                        <Link
                            className="font-semibold"
                            href={`/profile/${author.id}`}
                        >
                            {author.username}
                        </Link>{' '}
                        about{' '}
                        <Link
                            className="font-semibold"
                            href={`/profile/${reviewedUser.id}`}
                        >
                            {reviewedUser.username}
                        </Link>
                        :
                    </p>
                    <div className="flex items-center">
                        <div className="flex -ml-1">
                            {rate &&
                                new Array(rate)
                                    .fill(rate)
                                    .map((item, id) => (
                                        <img
                                            key={id}
                                            className="min-w-7 w-full h-7 [&:not(:first-child)]:-ml-3"
                                            src="/default-tee.png"
                                            alt="tee"
                                        />
                                    ))}
                        </div>
                        <span className="ml-2 text-[12px]">
                            {timeAgo.format(new Date(createdAt))}
                        </span>
                    </div>
                </div>
            </div>
            <hr className="text-[#89745A]" />
            <p className="px-2.5 mt-4 pb-2">{review}</p>
        </div>
    );
}
