import classNames from 'classnames';
import { Dispatch, SetStateAction, useState } from 'react';

type OwnProps = {
    className?: string;
    children: ({
        step,
        setStep,
    }: {
        step: number;
        setStep: Dispatch<SetStateAction<number>>;
    }) => React.ReactNode;
};

export function Stepper({ children, className }: OwnProps) {
    const [step, setStep] = useState(1);

    return (
        <div className="relative overflow-hidden">
            <div
                className={classNames('w-full flex transition-all', {
                    [className || '']: className,
                })}
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
                {children({ step, setStep })}
            </div>
        </div>
    );
}
