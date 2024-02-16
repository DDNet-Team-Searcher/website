import classNames from 'classnames';
import React, { Ref, useState } from 'react';
import { Arrow } from './Arrow';

type OwnProps = {
    children: React.ReactNode;
    className?: string;
    controls?: boolean;
};

export type CarouselRef = {
    goTo: (n: number) => void;
    next: () => void;
    prev: () => void;
    current: () => number;
    count: () => number;
};

export const Carousel = React.forwardRef<CarouselRef, OwnProps>(
    ({ children, controls = true, className }: OwnProps, ref: Ref<any>) => {
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
                className={classNames('relative overflow-hidden', {
                    [className || '']: !!className,
                })}
            >
                <div
                    className="[&>*]:min-w-full flex relative duration-200 ease-in-out transition-all"
                    style={{ right: `${cur}00%` }}
                >
                    {children}
                </div>
                {controls && (
                    <>
                        <Arrow
                            className="absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={prev}
                        />
                        <Arrow
                            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                            direction={'right'}
                            onClick={next}
                        />
                    </>
                )}
            </div>
        );
    },
);
