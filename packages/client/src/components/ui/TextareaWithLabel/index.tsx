import classNames from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';

type OwnProps = {
    label: string;
    required?: boolean;
    className?: {
        container?: string;
        textarea?: string;
    };
    register: UseFormRegisterReturn;
    [key: string]: any;
};

export const TextareaWithLabel = ({
    className,
    required,
    label,
    register,
    ...props
}: OwnProps) => {
    const rand = Math.random();

    return (
        <div
            className={classNames('flex flex-col w-full', {
                [className?.container || '']: className?.container,
            })}
        >
            <label
                // htmlFor={id + '' + rand}
                className="text-[12px] uppercase w-full resize-none"
            >
                {label}
                {required && <span className="text-error">*</span>}
            </label>
            <textarea
                {...register}
                className={classNames(
                    'bg-[rgba(0,0,0,.25)] rounded-[5px] py-3 outline-0 transition-colors duration-300 border-[1px] border-[rgba(0,0,0,0)] focus:border-primary-1 px-2.5 text-high-emphasis mt-1',
                    { [className?.textarea || '']: className?.textarea },
                )}
                {...props}
            // id={id + '' + rand}
            />
        </div>
    );
};
