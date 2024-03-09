'use client';

import { Avatar } from '@/components/Avatar';
import { useGetUsersQuery, useSetRoleMutation } from '@/features/api/users.api';
import Link from 'next/link';

//NOTE: do not reorder these elements if you dont know what you're doing
const roles = ['None', 'Verified', 'Mod', 'Admin'];

export default function Users() {
    const { data, isLoading, refetch } = useGetUsersQuery();
    const [setRole] = useSetRoleMutation();

    const onChange = async (userId: number, roleId: number) => {
        await setRole({ userId, roleId }).unwrap();
        refetch();
    };

    return (
        <div>
            <div className="flex p-2">
                <p className="uppercase text-high-emphasis text-[12px] basis-[50%]">
                    Username
                </p>
                {roles.map((role, id) => (
                    <p
                        key={id}
                        className="uppercase text-high-emphasis text-[12px] grow text-center"
                    >
                        {role}
                    </p>
                ))}
            </div>
            <ul>
                {!isLoading &&
                    data &&
                    data.status === 'success' &&
                    data.data.map((user) => (
                        <li
                            key={user.id}
                            className="text-medium-emphasis flex items-center p-2 odd:bg-primary-2 even:bg-primary-3 first:rounded-t-[10px] last:rounded-b-[10px]"
                        >
                            <div className="flex items-center basis-[50%]">
                                <Avatar
                                    username={user.username}
                                    src={user.avatar}
                                    size={30}
                                />
                                <Link
                                    className="ml-2"
                                    href={`/profile/${user.id}`}
                                >
                                    {user.username}
                                </Link>
                            </div>
                            {roles.map((role, id) => (
                                <input
                                    key={id}
                                    type="radio"
                                    name={`${user.id}`}
                                    checked={
                                        user.role === role ||
                                        (user.role === null && role === 'None')
                                    }
                                    className="grow"
                                    onChange={() => onChange(user.id, id)}
                                />
                            ))}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
