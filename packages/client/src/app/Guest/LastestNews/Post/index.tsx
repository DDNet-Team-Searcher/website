type OwnProps = {
    post: {
        title: string;
        pubDate: string;
        author: string;
        textPreview: string;
    };
};
export function Post({ post }: OwnProps) {
    return (
        <div className="max-w-[340px] basis-[260px] grow-[1] mx-5 bg-primary-2 rounded-[20px] my-5">
            <img
                className="rounded-t-[20px] max-h-[150px] h-full max-w-full w-full"
                src="/test.png"
            />
            <div className="pt-2.5 pb-8 px-5">
                <span className="text-medium-emphasis m-0">{post.pubDate}</span>
                <p className="text-high-emphasis m-0 font-medium mt-5">
                    {post.title}
                </p>
                <p className={'text-medium-emphasis m-0 mt-4'}>
                    {post.textPreview}
                </p>
                <div className="mt-7 flex justify-between">
                    <span className="text-high-emphasis font-medium m-0">
                        {post.author}
                    </span>
                    <button className="text-primary-1 flex items-center">
                        More{' '}
                        <img
                            src="/more.png"
                            className="ml-2.5"
                            alt="arrow left icon"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
