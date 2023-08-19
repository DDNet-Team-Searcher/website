import classNames from 'classnames';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type OwnProps = {
    className?: string;
    step?: number;
    children:
    | (({
        step,
        setStep,
    }: {
        step: number;
        setStep: Dispatch<SetStateAction<number>>;
    }) => React.ReactNode)
    | React.ReactNode[];
};

export function Stepper({ children, className, step }: OwnProps) {
    const [currentStep, setCurrentStep] = useState(step || 1);

    useEffect(() => {
        if (step) {
            setCurrentStep(step);
        }
    }, [step]);

    return (
        <div className="relative overflow-hidden">
            <div
                className={classNames('w-full flex transition-all', {
                    [className || '']: className,
                })}
                style={{
                    transform: `translateX(-${(currentStep - 1) * 100}%)`,
                }}
            >
                {typeof children == 'function' &&
                    children({ step: currentStep, setStep: setCurrentStep })}
                {typeof children == 'object' && children}
            </div>
        </div>
    );
}
