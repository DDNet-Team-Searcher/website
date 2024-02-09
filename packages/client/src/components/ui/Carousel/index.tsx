import classNames from 'classnames';
import React, { Ref, useState } from 'react';

type OwnProps = {
    children: React.ReactNode;
    className?: string;
};

export type CarouselRef = {
    goTo: (n: number) => void;
    next: () => void;
    prev: () => void;
    current: () => number;
    count: () => number;
};

export const Carousel = React.forwardRef<CarouselRef, OwnProps>(
    ({ children, className }: OwnProps, ref: Ref<any>) => {
        const [cur, setCur] = useState(0);
        let max = React.Children.count(children) - 1;

        const next = () => {
            if (cur + 1 > max) {
                setCur(0);
            } else {
                setCur(cur + 1);
            }
        };

        const prev = () => {
            if (cur == 0) {
                setCur(max);
            } else {
                setCur(cur - 1);
            }
        };

        const goTo = (n: number) => {
            if (0 <= n && n <= max) {
                setCur(n);
            } else {
                setCur(0);
            }
        };

        const current = () => {
            return cur;
        };

        const count = () => {
            return max;
        };

        React.useImperativeHandle<CarouselRef, CarouselRef>(
            ref,
            () => ({
                goTo,
                next,
                prev,
                current,
                count,
            }),
            [cur],
        );

        return (
            <div
                ref={ref}
                className={classNames('overflow-hidden', {
                    [className || '']: !!className,
                })}
            >
                <div
                    className="[&>*]:min-w-full flex relative duration-200 ease-in-out transition-all"
                    style={{ right: `${cur}00%` }}
                >
                    {children}
                </div>
            </div>
        );
    },
);
