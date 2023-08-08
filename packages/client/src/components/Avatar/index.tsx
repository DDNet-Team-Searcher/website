import { intToRGB } from '@/utils/intToRGB';
import { stringToNum } from '@/utils/numFromString';
import classNames from 'classnames';

interface OwnProps {
    src: string | null;
    username: string;
    size?: number;
    className?: string;
}

export function Avatar({ src, username, size = 20, className }: OwnProps) {
    const color = '#' + intToRGB(stringToNum(username));

    return (
        <div
            className={classNames('w-full flex justify-center items-center', {
                [className || '']: !!className,
            })}
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            {src === null ? (
                <p
                    style={{ background: color, fontSize: size / 1.5 }}
                    className="w-full rounded-[50%] flex items-center justify-center select-none"
                >
                    {username[0]}
                </p>
            ) : (
                <img
                    className="w-full h-full rounded-full object-cover"
                    src={src}
                />
            )}
        </div>
    );
}
