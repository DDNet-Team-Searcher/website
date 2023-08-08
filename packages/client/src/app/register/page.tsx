'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { Form } from './Form';

export default function Register() {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <>
            <div
                className={`mb-[150px] bg-[url("/register-page-background.png")] h-[1028px]`}
            >
                <div className={'pt-[120px] max-w-fit mx-auto'}>
                    <p
                        className={classNames('text-4xl text-high-emphasis', {
                            hidden: currentStep === 3,
                        })}
                    >
                        Create your account
                        <br /> and become the part of the{' '}
                        <s className="text-primary-1">community.</s>
                    </p>
                    <Form currentStep={currentStep} setCurrentStep={setCurrentStep} />
                </div>
            </div>
        </>
    );
}
