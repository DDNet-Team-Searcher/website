import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
    const urls = [
        {
            path: 'account',
            name: 'Account',
        },
        {
            path: 'notifications',
            name: 'Notifications',
        },
    ];
    const pathname = usePathname();

    return (
        <aside className="basis-[170px]">
            <p className="uppercase text-[12px] ml-2.5 text-high-emphasis font-medium">
                User Settings
            </p>
            <div className="mt-5">
                {urls.map((url) => (
                    <Link
                        href={`/settings/${url.path}`}
                        className={classNames(
                            'block mt-0.5 rounded-[10px] p-2.5 text-medium-emphasis max-w-[170px] w-full',
                            {
                                'bg-primary-2 !text-high-emphasis':
                                    pathname === `/settings/${url.path}`,
                            },
                        )}
                    >
                        {url.name}
                    </Link>
                ))}
            </div>
        </aside>
    );
};
