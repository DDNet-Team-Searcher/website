import { CSSProperties } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Review } from './Review';

const arrowStyles: CSSProperties = {
    position: 'absolute',
    zIndex: 999,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    cursor: 'pointer',
};

const reviews = [
    {
        username: 'Yo mum',
        review: 'Cul!',
    },
    {
        username: 'Stepfunn',
        review: "Milkeey, nobody's gonna use it anyways.",
    },
];

export function Reviews() {
    return (
        <div className="mt-[150px] text-high-emphasis">
            <p className="text-3xl font-medium text-center">
                What homies are saying &apos;bout us:
            </p>
            <Carousel
                className="max-w-[800px] mt-16 mx-auto"
                infiniteLoop
                showStatus={false}
                showThumbs={false}
                showIndicators={false}
                autoPlay
                renderArrowNext={(clickHandler, hasNext, label) =>
                    hasNext && (
                        <p
                            style={{ ...arrowStyles, right: '15px' }}
                            title={label}
                            onClick={clickHandler}
                        >
                            <img src="/right-slider-button.png" />
                        </p>
                    )
                }
                renderArrowPrev={(clickHandler, hasPrev, label) =>
                    hasPrev && (
                        <p
                            style={{ ...arrowStyles, left: '15px' }}
                            title={label}
                            onClick={clickHandler}
                        >
                            <img src="/left-slider-button.png" />
                        </p>
                    )
                }
            >
                {reviews.map((review, index) => (
                    <Review review={review} key={index} />
                ))}
            </Carousel>
        </div>
    );
}
