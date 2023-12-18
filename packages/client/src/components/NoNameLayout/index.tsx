import classNames from 'classnames';
import { ReactNode } from 'react';
import { Navbar } from './Navbar';

type OwnProps = {
    children: ReactNode;
    className?: string;
    title: string;
    urls: {
        path: string;
        name: string;
    }[];
};

export function NoNameLayout({ children, className, urls, title }: OwnProps) {
    return (
        <main className="max-w-[1110px] w-full mx-auto flex mt-24">
            <Navbar urls={urls} title={title} />
            <section
                className={classNames('ml-[100px] grow', {
                    [className || '']: !!className,
                })}
            >
                {children}
            </section>
        </main>
    );
}
