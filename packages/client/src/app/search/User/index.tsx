import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import { PeopleIcon } from '@/components/ui/Icons/People';
import { useFollowUserMutation } from '@/features/api/users.api';
import { getTier } from '@/utils/getTier';
import { useAppDispatch } from '@/utils/hooks/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUserFavoriteServer } from '@/store/slices/user';

type OwnProps = {
    authedUserId: number | null;
    user: {
        username: string;
        avatar: string | null;
        tier: number;
        id: number;
        verified: boolean;
        _count: {
            followers: number;
            following: number;
        };
        isFollowing: boolean;
    };
};

export function User({
    authedUserId,
    user: {
        username,
        tier,
        id,
        isFollowing: isFollowingIDK,
        _count: { followers },
        ...user
    },
}: OwnProps) {
    const dispatch = useAppDispatch();
    const tierName = getTier(tier);
    const [favoriteServer, setFavoriteServer] = useState<string>();
    const [followUser] = useFollowUserMutation();
    const [isFollowing, setIsFollowing] = useState(isFollowingIDK);

    useEffect(() => {
        dispatch(getUserFavoriteServer(username)).then((res) => {
            setFavoriteServer(res);
        });
    }, []);

    const onClick = async () => {
        await followUser(id).unwrap();
        setIsFollowing((prev) => !prev);
    };

    return (
        <div className="flex items-center bg-primary-2 rounded-[10px] px-5 py-2.5">
            <Avatar src={user.avatar} username={username} size={50} />
            <div className="ml-5">
                <Link
                    className="text-xl text-high-emphasis"
                    href={`/profile/${id}`}
                >
                    {username}
                </Link>
                <p className="flex items-center text-medium-emphasis text-xs">
                    <span>{tierName} tier</span>
                    <span className="mx-1 text-xl font-bold">∙</span>
                    <img
                        className="max-w-[30px]"
                        src={`https://ddnet.org/countryflags/${favoriteServer}.png`}
                    />
                    <span className="mx-1 text-xl font-bold">∙</span>
                    <span className="flex items-center">
                        <PeopleIcon
                            color="var(--medium-emphasis)"
                            className="max-w-[16px] mr-1"
                        />
                        {followers}
                    </span>
                </p>
            </div>
            {id != authedUserId && (
                <Button
                    className="ml-auto"
                    styleType="filled"
                    onClick={onClick}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
            )}
        </div>
    );
}
