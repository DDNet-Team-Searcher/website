import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './styles.module.css';

type OwnProps = {
    label: string;
    datalist?: string[];
    className?: {
        container?: string;
    };
    register: UseFormRegisterReturn;
    errors?: FieldErrors;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function InputWithLabel({
    id,
    required,
    className,
    datalist,
    label,
    register,
    errors,
    ...props
}: OwnProps) {
    const labelId = label.replace(' ', '_');
    const fieldName = register.name;
    const error = (errors || {})[fieldName]?.message as string;

    return (
        <div
            className={classNames('flex flex-col w-full', {
                [className?.container || '']: className?.container,
            })}
        >
            <label
                htmlFor={labelId}
                className={classNames('text-[12px] uppercase', {
                    'text-error': !!error,
                })}
            >
                {label}
                {required && <span className="text-error">*</span>}
                {!!error && ` - ${error}`}
            </label>
            <input
                {...register}
                type={'text'}
                className={
                    styles.input +
                    ` w-full transition-all duration-300 bg-[rgba(0,0,0,.25)] outline-0 border-[1px] border-[rgba(0,0,0,0)] focus:border-primary-1 rounded-[5px] py-3 px-2.5 color-[white] mt-1 [&::-webkit-inner-spin-button]:hidden`
                }
                list={datalist && id + '_1'}
                {...props}
                id={labelId}
            />
            {datalist && (
                <datalist id={id + '_1'}>
                    {datalist.map((el: string) => (
                        <option key={el} value={el}></option>
                    ))}
                </datalist>
            )}
        </div>
    );
}
