type OwnProps = {
    direction?: 'left' | 'right' | 'top' | 'bottom';
    className?: string;
    onClick?: () => void;
};

export function Arrow({
    className = '',
    direction = 'left',
    onClick,
}: OwnProps) {
    let angle = 0;

    switch (direction) {
        case 'left':
            angle = -180;
            break;
        case 'right':
            angle = 0;
            break;
        case 'top':
            angle = -90;
            break;
        case 'bottom':
            angle = 90;
            break;
    }

    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${angle}deg)` }}
            className={className}
            onClick={onClick}
        >
            <g>
                <path
                    d="M29.4069 19.1863L10.5931 19.1863M21.5678 27.0253L29.4069 19.1863L21.5678 11.3472"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <circle
                cx="20"
                cy="20"
                r="19.5"
                transform="rotate(-180 20 20)"
                stroke="white"
                strokeOpacity="0.87"
            />
            <defs>
                <clipPath>
                    <rect
                        width="26.6066"
                        height="26.6066"
                        fill="white"
                        transform="translate(20 38) rotate(-135)"
                    />
                </clipPath>
            </defs>
        </svg>
    );
}
