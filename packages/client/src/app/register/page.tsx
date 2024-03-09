'use client';

import { useState } from 'react';
import { Form } from './Form';
import { Carousel, CarouselRef } from '@/components/ui/Carousel';
import { RegistrationSuccessful } from './RegistrationSuccessful';
import classNames from 'classnames';

export default function Register() {
    const [email, setEmail] = useState('');
    const [ref, setRef] = useState<CarouselRef | null>(null);

    return (
        <>
            <div
                className={`mb-[150px] bg-[url("/register-page-background.png")] h-[1028px]`}
            >
                <div className={'pt-[120px] max-w-fit mx-auto'}>
                    <p
                        className={classNames(
                            'text-4xl text-high-emphasis mx-24',
                            {
                                hidden: ref?.current() === 1,
                            },
                        )}
                    >
                        Create your account
                        <br /> and become the part of the{' '}
                        <s className="text-primary-1">community.</s>
                    </p>
                    <Carousel
                        ref={setRef}
                        controls={false}
                        className="max-w-[860px]"
                    >
                        <Form next={ref?.next || null} setEmail={setEmail} />
                        <RegistrationSuccessful email={email} />
                    </Carousel>
                </div>
            </div>
        </>
    );
}
