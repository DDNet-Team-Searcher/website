'use client';

import { useLingui } from '@lingui/react';
import Link from 'next/link';

const links = {
    'source_code': 'https://github.com/DDNet-Team-Searcher'
}

export function Footer() {
    const { i18n } = useLingui();

    return (
        <footer className="flex text-medium-emphasis px-40">
            <img src="/logo.png" />
            <ul className="ml-auto">
                {Object.keys(links).map((key, id) => (
                    <li key={id}><Link href={links[key as keyof typeof links]}>{i18n._(key)}</Link></li>
                ))}
            </ul>
            <Link href="/" locale="uk">owo</Link>
            <span className="ml-7 text-sm">
                Made with <s>pain</s> love <span className="text-primary-1">&lt;3</span>
            </span>
        </footer>
    );
}
