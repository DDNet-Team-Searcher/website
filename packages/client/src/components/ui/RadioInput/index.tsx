import classNames from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';

type OwnProps = {
    id: string;
    register: UseFormRegisterReturn;
    value: string;
    className?: {
        label?: string;
        input?: string;
        wrapper?: string;
    };
};

export function RadioInput({ className, id, register, value }: OwnProps) {
    return (
        <input
            type="radio"
            {...register}
            className={classNames(
                'w-5 h-5 appearance-none rounded-full border-2 border-primary-1 flex justify-center items-center before:w-2.5 before:h-2.5 before:rounded-full before:scale-0 before:duration-[120ms] before:ease-in-out before:bg-primary-1 checked:before:scale-100',
                { [className?.input || '']: !!className?.input },
            )}
            id={id}
            value={value}
        />
    );
}
