'use client';

import { useTranslation } from '@/i18/client';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type OwnProps = {
    title: string;
    urls: {
        path: string;
        name: string;
    }[];
};

export function Navbar({ title, urls }: OwnProps) {
    const pathname = usePathname();
    const { t } = useTranslation('navbar');

    return (
        <aside className="basis-[170px]">
            <p className="uppercase text-[12px] ml-2.5 text-high-emphasis font-medium">
                {t(title)}
            </p>
            <div className="mt-5">
                {urls.map((url, id) => (
                    <Link
                        key={id}
                        href={`/settings/${url.path}`}
                        className={classNames(
                            'block mt-0.5 rounded-[10px] p-2.5 text-medium-emphasis max-w-[170px] w-full',
                            {
                                'bg-primary-2 !text-high-emphasis':
                                    pathname === `/settings/${url.path}`,
                            },
                        )}
                    >
                        {t(url.name)}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
