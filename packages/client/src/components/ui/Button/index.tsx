import { CSSProperties } from 'react';
import classNames from 'classnames';

type OwnProps = {
    type?: 'submit' | 'reset' | 'button';
    styleType: 'filled' | 'bordered';
    style?: CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    tabIndex?: number;
    disabled?: boolean;
    id?: string;
    form?: string;
    children: React.ReactNode;
};

export function Button({
    type = 'button',
    tabIndex,
    styleType,
    disabled = false,
    onClick,
    style,
    className,
    ...props
}: OwnProps) {
    return (
        <button
            disabled={disabled}
            tabIndex={tabIndex}
            className={classNames(
                'p-2.5 rounded-[10px] text-[white] border-[1px] border-[rgba(0,0,0,0)] flex',
                {
                    'bg-primary-1': styleType === 'filled',
                },
                {
                    'border-primary-1': styleType === 'bordered',
                },
                {
                    'opacity-60': disabled,
                },
                className,
            )}
            type={type}
            style={style || {}}
            onClick={onClick}
            {...props}
        >
            {props.children}
        </button>
    );
}
