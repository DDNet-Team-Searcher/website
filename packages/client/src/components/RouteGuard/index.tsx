'use client';

import { useAppSelector } from '@/utils/hooks/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type OwnProps = {
    children: ReactNode;
};

export function RouteGuard({ children }: OwnProps) {
    const publicUrls = ['/', '/login', '/register'];
    const isAuthed = useAppSelector((state) => state.user.isAuthed);
    const router = useRouter();
    const pathname = usePathname();

    if (
        isAuthed === false &&
        !publicUrls.includes(pathname)
    ) {
        router.push('/login');
    }

    return <>{children}</>;
}
