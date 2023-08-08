type OwnProps = {
    color?: string;
};

export function CalendarIcon({ color = '#000' }: OwnProps) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_457_1257)">
                <path
                    d="M15.0001 3.3335H5.00008C3.15913 3.3335 1.66675 4.82588 1.66675 6.66683V15.0002C1.66675 16.8411 3.15913 18.3335 5.00008 18.3335H15.0001C16.841 18.3335 18.3334 16.8411 18.3334 15.0002V6.66683C18.3334 4.82588 16.841 3.3335 15.0001 3.3335Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6.66675 1.66675V5.00008M13.3334 1.66675V5.00008M1.66675 8.33342H18.3334"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_457_1257">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
