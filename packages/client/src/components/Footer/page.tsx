import { createTranslation } from '@/i18/server';
import Link from 'next/link';

const links = {
    discord: 'https://discord.gg/g69MYFA4Ba',
    source_code: 'https://github.com/DDNet-Team-Searcher',
};

export async function Footer() {
    const { t } = await createTranslation("footer");

    return (
        <footer className="flex text-medium-emphasis py-2 px-40 mt-auto">
            <img src="/logo.png" />
            <ul className="ml-auto flex">
                {Object.keys(links).map((key, id) => (
                    <li key={id} className="ml-5">
                        <Link href={links[key as keyof typeof links]}>
                            {t(key)}
                        </Link>
                    </li>
                ))}
            </ul>
            <span className="ml-10 text-sm">
                Made with <s>pain</s> love{' '}
                <span className="text-primary-1">&lt;3</span>
            </span>
        </footer>
    );
}
