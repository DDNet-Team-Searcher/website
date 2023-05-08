import classNames from 'classnames';
import { ReactNode } from 'react';
import { Navbar } from './Navbar';

type OwnProps = {
    children: ReactNode;
    className?: string;
};

export const SettingsLayout = ({ children, className }: OwnProps) => {
    return (
        <main className="max-w-[1110px] mx-auto flex mt-24">
            <Navbar />
            <section
                className={classNames('ml-[100px] grow', {
                    [className || '']: !!className,
                })}
            >
                {children}
            </section>
        </main>
    );
};
