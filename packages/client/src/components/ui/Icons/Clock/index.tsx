type OwnProps = {
    color?: string;
    className?: string;
};

export const ClockIcon = ({ color = '#000', className }: OwnProps) => {
    return (
        <svg
            className={className || ''}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.75 4C9.75 3.58579 9.41421 3.25 9 3.25C8.58579 3.25 8.25 3.58579 8.25 4V9C8.25 9.25859 8.38321 9.49895 8.6025 9.636L11.6025 11.511C11.9538 11.7305 12.4165 11.6238 12.636 11.2725C12.8555 10.9212 12.7488 10.4585 12.3975 10.239L9.75 8.58431V4Z"
                fill={color}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0.25C4.16751 0.25 0.25 4.16751 0.25 9C0.25 13.8325 4.16751 17.75 9 17.75C13.8325 17.75 17.75 13.8325 17.75 9C17.75 4.16751 13.8325 0.25 9 0.25ZM1.75 9C1.75 4.99594 4.99594 1.75 9 1.75C13.0041 1.75 16.25 4.99594 16.25 9C16.25 13.0041 13.0041 16.25 9 16.25C4.99594 16.25 1.75 13.0041 1.75 9Z"
                fill={color}
            />
        </svg>
    );
};
