'use client';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/Button';
import {
    useGetBannedUsersQuery,
    useUnbanUserMutation,
} from '@/features/api/users.api';
import Link from 'next/link';

export default function BannedUsersPage() {
    const { data, refetch } = useGetBannedUsersQuery();
    const [unban] = useUnbanUserMutation();

    const onClick = async (userId: number) => {
        try {
            await unban({
                userId,
            }).unwrap();
            refetch();
        } catch (e) {}
    };

    return (
        <div className="[&>:not(:first-child)]:mt-5">
            {data &&
                data.status === 'success' &&
                data.data.map((user) => (
                    <div
                        className="bg-primary-2 p-5 rounded-[10px] group hover:opacity-100"
                        key={user.id}
                    >
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Link href={`/profile/${user.id}`}>
                                    <Avatar
                                        username={user.username}
                                        size={30}
                                        src={user.avatar}
                                    />
                                </Link>
                                <Link href="/profile/${1}" className="ml-3">
                                    <p className="text-high-emphasis">
                                        {user.username}
                                    </p>
                                </Link>
                            </div>
                            <Button
                                styleType="filled"
                                className="opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                                onClick={() => onClick(user.id)}
                            >
                                Unban
                            </Button>
                        </div>
                        <h3 className="uppercase text-high-emphasis mt-2 font-medium">
                            Ban reason
                        </h3>
                        {user.reason && (
                            <p className="text-medium-emphasis">
                                {user.reason}
                            </p>
                        )}
                        {!user.reason && (
                            <p className="text-medium-emphasis italic">
                                No reason provided
                            </p>
                        )}
                    </div>
                ))}
            {data && data.status === 'success' && !data.data.length && (
                <p className="text-high-emphasis text-center">
                    Seems like there&apos;s no banned users. Pog
                </p>
            )}
        </div>
    );
}
