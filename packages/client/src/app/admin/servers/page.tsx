'use client';

import { useGetServersQuery } from '@/features/api/servers.api';
import classNames from 'classnames';
import Link from 'next/link';

export default function ServersPage() {
    const { data } = useGetServersQuery();

    return (
        <div>
            {data &&
                data?.status === 'success' &&
                data.data.map((server) => (
                    <div
                        key={server.id}
                        className="bg-primary-2 mt-5 text-medium-emphasis rounded-md p-3"
                    >
                        <Link
                            href={`/admin/servers/${server.id}`}
                            className="text-2xl hover:text-high-emphasis"
                        >
                            Server name {server.id}
                        </Link>
                        <p className="mt-1">Ip: {server.ip}</p>
                        <p>
                            Status:{' '}
                            <span
                                className={classNames({
                                    'text-error': !server.online,
                                    'text-success': server.online,
                                })}
                            >
                                {server.online ? 'Online' : 'Offline'}
                            </span>
                        </p>
                    </div>
                ))}
            {data && data.status === 'success' && data.data.length == 0 && (
                <p className="text-high-emphasis text-center">No servers :(</p>
            )}
        </div>
    );
}
