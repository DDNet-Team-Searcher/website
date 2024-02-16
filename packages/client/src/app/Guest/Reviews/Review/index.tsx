type OwnProps = {
    review: {
        review: string;
        username: string;
    };
};

export function Review({ review: { username, review } }: OwnProps) {
    return (
        <div>
            <p className="max-w-[80%] mx-auto text-center">
                &quot;{review}&quot;©
            </p>
            <div className="mx-auto mt-7 flex flex-col items-center justify-center">
                <img
                    src={'/default-tee.png'}
                    className="max-w-[100px]"
                    alt="default tee"
                />
                <p>{username}</p>
            </div>
        </div>
    );
}
