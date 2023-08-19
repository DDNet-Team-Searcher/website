import { Post } from './Post';

const posts = [
    {
        title: 'Lol kek',
        pubDate: '04.04.2022',
        author: 'MilkeeyCat',
        textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`,
    },
    {
        title: 'Lol kek',
        pubDate: '04.04.2022',
        author: 'MilkeeyCat',
        textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`,
    },
    {
        title: 'Lol kek',
        pubDate: '04.04.2022',
        author: 'MilkeeyCat',
        textPreview: `Icefish skipjack tuna sand tilefish tuna red snapper mustache triggerfish Dolly Varden trout Jack Dempsey pike conger. Sábalo jack trout prickleback round whitefish, "redside parrotfish," freshwater eel, desert pupfish porcupinefish silverside emperor....`,
    },
];

export function LatestNews() {
    return (
        <div className="my-[150px]">
            <p className="font-medium text-3xl text-high-emphasis text-center">
                Last news
            </p>
            <div className="flex justify-center flex-wrap">
                {posts.map((post, id) => (
                    <Post post={post} key={id} />
                ))}
            </div>
        </div>
    );
}
