type OwnProps = {
    review: {
        review: string;
        username: string;
    };
};

export function Review({ review: { username, review } }: OwnProps) {
    return (
        <div>
            <p className="max-w-[80%] mx-auto">&quot;{review}&quot;©</p>
            <div className="mx-auto mt-7 flex items-center justify-center flex-col">
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
