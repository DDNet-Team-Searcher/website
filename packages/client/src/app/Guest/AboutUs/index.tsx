export function AboutUs() {
    const fax = [
        { imageUrl: '/default-tee.png', text: '0 runs already done' },
        {
            imageUrl: '/default-tee.png',
            text: '>0 people are finding mates for the run',
        },
        { imageUrl: '/default-tee.png', text: '>0 active users' },
        {
            imageUrl: '/default-tee.png',
            text: 'I finally found a mate to finish Sunny Side Up',
        },
        { imageUrl: '/default-tee.png', text: '0+ events are waiting for you' },
    ];

    return (
        <div className="max-w-[840px] mx-auto px-10 -mt-[200px]">
            <p className="text-3xl font-medium text-high-emphasis">
                Some useless info about DDrace Team Searcher.:
            </p>
            <div className="flex flex-wrap justify-around">
                {fax.map(({ imageUrl, text }, id) => (
                    <div
                        key={id}
                        className="mt-12 mx-2.5 border-[1px] border-primary-1 sm:max-w-[230px] w-full flex flex-col items-center rounded-[20px] text-high-emphasis bg-gradient-to-br from-[#312A22] to-[rgba(49,42,34,.2)]"
                    >
                        <img
                            src={imageUrl}
                            className="-mt-12"
                            alt="tee image"
                        />
                        <p className="mt-2.5 mx-6 mb-7">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
