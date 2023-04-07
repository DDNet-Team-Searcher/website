import { intToRGB } from '@/utils/intToRGB';
import { stringToNum } from '@/utils/numFromString';

interface OwnProps {
    src: string | null;
    username: string;
    size?: number;
}

export const Avatar: React.FC<OwnProps> = ({ src, username, size = 20 }) => {
    const color = '#' + intToRGB(stringToNum(username));

    return (
        <div
            className="w-full flex justify-center items-center"
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
                <img src={src} />
            )}
        </div>
    );
};
