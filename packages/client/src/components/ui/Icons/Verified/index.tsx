type OwnProps = {
    color?: string;
    className?: string;
};

export function VerifiedIcon({ color, className }: OwnProps) {
    return (
        <svg
            className={className || ''}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="2.9292"
                y="2.92871"
                width="14.1421"
                height="14.1421"
                fill={color}
            />
            <rect
                y="10"
                width="14.1421"
                height="14.1421"
                transform="rotate(-45 0 10)"
                fill={color}
            />
            <rect
                x="0.34082"
                y="7.41211"
                width="14.1421"
                height="14.1421"
                transform="rotate(-30 0.34082 7.41211)"
                fill={color}
            />
            <rect
                x="0.34082"
                y="12.5884"
                width="14.1421"
                height="14.1421"
                transform="rotate(-60 0.34082 12.5884)"
                fill={color}
            />
            <rect
                x="1.33936"
                y="5"
                width="14.1421"
                height="14.1421"
                transform="rotate(-15 1.33936 5)"
                fill={color}
            />
            <rect
                x="1.33936"
                y="15"
                width="14.1421"
                height="14.1421"
                transform="rotate(-75 1.33936 15)"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.6388 6.89945C14.8641 7.12475 14.8641 7.49004 14.6388 7.71534L9.25418 13.1C9.02887 13.3253 8.66359 13.3253 8.43828 13.1L5.36136 10.023C5.13606 9.79773 5.13606 9.43244 5.36136 9.20714C5.58666 8.98184 5.95195 8.98184 6.17725 9.20714L8.84623 11.8761L13.8229 6.89945C14.0482 6.67414 14.4135 6.67414 14.6388 6.89945Z"
                fill="white"
            />
        </svg>
    );
}
