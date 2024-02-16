import classNames from 'classnames';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';

type OwnProps = {
    placeholder?: string;
    register: UseFormRegisterReturn;
    errors: FieldErrors;
    type?: string;
    showPlaceholder?: boolean;
    [key: string]: any;
    classes?: {
        input?: string;
        container?: string;
    };
};

export function Input({
    placeholder,
    register,
    errors,
    type,
    classes,
    showPlaceholder = true,
    ...props
}: OwnProps) {
    const errorIcon = '/error.png';
    const fieldName = register.name;
    const error = errors[fieldName]?.message as string;

    return (
        <div
            className={classNames(
                'relative',
                {
                    [(classes && classes.container) || '']:
                        classes && !!classes.container,
                },
                {
                    '[&>input:not(:placeholder-shown)+span::before]:opacity-100 [&>input:not(:placeholder-shown)]:pt-[15px] [&>input:not(:placeholder-shown)]:pb-[5px]':
                        showPlaceholder,
                },
            )}
        >
            <input
                {...register}
                {...props}
                placeholder={placeholder}
                className={classNames(
                    'transition-all duration-300 border-[1px] bg-[rgba(0,0,0,.45)] border-[rgba(0,0,0,0)] rounded-[10px] py-2.5 px-[12px] text-[white] outline-0 focus:border-primary-1',
                    {
                        [(classes && classes.input) || '']:
                            classes && !!classes.input,
                    },
                )}
                type={type ?? 'text'}
            />
            <span
                data-placeholder={placeholder}
                className="before:absolute before:content-[attr(data-placeholder)] before:text-primary-1 before:transition-all before:duration-300 before:text-[10px] before:left-2.5 before:top-1 before:opacity-0"
            />
            {error && (
                <img
                    src={errorIcon}
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 animate-pulse select-none"
                    draggable={false}
                    title={error}
                    alt="error icon"
                />
            )}
        </div>
    );
}
