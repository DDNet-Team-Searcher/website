import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames';

type OwnProps = {
    type?: 'submit' | 'reset' | 'button';
    styleType: 'filled' | 'bordered';
    style?: CSSProperties;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    tabIndex?: number;
    disabled?: boolean;
};

export const Button: React.FC<PropsWithChildren<OwnProps>> = ({
    type = 'button',
    tabIndex,
    styleType,
    disabled,
    onClick,
    style,
    className,
    ...props
}) => {
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
                    '!border-primary-1': styleType === 'bordered',
                },
                className,
            )}
            type={type}
            style={style || {}}
            onClick={onClick}
        >
            {props.children}
        </button>
    );
};
