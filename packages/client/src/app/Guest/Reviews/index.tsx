import { Carousel } from '@/components/ui/Carousel';
import { Review } from './Review';

const reviews = [
    {
        username: 'Yo mum',
        review: 'Cul!',
    },
    {
        username: 'Stepfunn',
        review: "Milkeey, nobody's gonna use it anyways.",
    },
    {
        username: 'Lumpy ◐ω◑',
        review: "It's not gonna be realeased any time soon.",
    },
];

export function Reviews() {
    return (
        <div className="my-[150px] text-high-emphasis">
            <p className="text-3xl font-medium text-center">
                What homies are saying &apos;bout us:
            </p>
            <Carousel className="max-w-[800px] mt-16 mx-auto">
                {reviews.map((review, index) => (
                    <Review review={review} key={index} />
                ))}
            </Carousel>
        </div>
    );
}
