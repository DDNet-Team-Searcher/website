type OwnProps = {
    color?: string;
    className?: string;
};

export function AddIcon({ color = '#000', className }: OwnProps) {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className || ''}
        >
            <path
                d="M13.2812 11.7188V6.25H11.7188V11.7188H6.25V13.2812H11.7188V18.75H13.2812V13.2812H18.75V11.7188H13.2812Z"
                fill={color}
            />
        </svg>
    );
}
