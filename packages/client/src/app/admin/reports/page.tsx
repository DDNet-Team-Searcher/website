'use client';

import { BanModal } from '@/components/BanModal';
import { Button } from '@/components/ui/Button';
import { useGetReportsQuery } from '@/features/api/users.api';
import Link from 'next/link';
import { useState } from 'react';

export default function ReportsPage() {
    const { data, refetch } = useGetReportsQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onClick = () => {
        setIsModalVisible(true);
    };

    const onClose = async () => {
        setIsModalVisible(false);
        await refetch();
    };

    return (
        <div className="[&>:not(:first-child)]:mt-5">
            {data &&
                data.status === 'success' &&
                data.data.map((report) => (
                    <div
                        className="bg-primary-2 p-5 rounded-[10px] group hover:opacity-100"
                        key={report.id}
                    >
                        <BanModal
                            visible={isModalVisible}
                            userId={report.reportedUserId}
                            onClose={onClose}
                        />
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <Link
                                    href={`/profile/${report.reportedUserId}`}
                                    className="text-high-emphasis ml-3 underline"
                                >
                                    {report.reportedUsername}
                                </Link>
                                <span className="text-high-emphasis ml-3">
                                    reported by
                                </span>
                                <Link
                                    href={`/profile/${report.reportedByUserId}`}
                                    className="text-high-emphasis ml-3 underline"
                                >
                                    <p className="text-high-emphasis">
                                        {report.reportedByUsername}
                                    </p>
                                </Link>
                            </div>
                            <Button
                                styleType="filled"
                                className="opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                                onClick={onClick}
                            >
                                Ban
                            </Button>
                        </div>
                        <h3 className="uppercase text-high-emphasis mt-2 font-medium">
                            Report reason
                        </h3>
                        {report.report && (
                            <p className="text-medium-emphasis">
                                {report.report}
                            </p>
                        )}
                        {!report.report && (
                            <p className="text-medium-emphasis italic">
                                No reason provided
                            </p>
                        )}
                    </div>
                ))}
            {data && data.status === 'success' && !data.data.length && (
                <p className="text-high-emphasis text-center">
                    Seems like there&apos;s no reports. Pog
                </p>
            )}
        </div>
    );
}
