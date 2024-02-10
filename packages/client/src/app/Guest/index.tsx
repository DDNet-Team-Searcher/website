import { Button } from '@/components/ui/Button';
import { AboutUs } from './AboutUs';
import { Reviews } from './Reviews';

export default function Guest() {
    return (
        <>
            <div className="bg-[url('/ddnet-gameplay.png')]">
                <div className="h-[1166px] pt-[170px] flex max-w-fit mx-auto px-10 xl:m-0 flex-col xl:pl-[400px] text-high-emphasis">
                    <h1 className="m-0 text-3xl md:text-6xl font-bold">
                        DDrace Team
                        <br /> Searcher<span className="text-primary-1">.</span>
                    </h1>
                    <h2 className="m-0 mt-2.5 text:xl md:text-3xl font-medium">
                        Find your dream team
                    </h2>
                    <p className="m-0 mt-6 max-w-[540px]">
                        I hope one day I will finish this website and you will
                        be able to find people to play with (or not ¯\_(ツ)_/¯
                        (I suck in design btw(I hope it doesnt look too much
                        cringe)))
                    </p>
                    <div className="flex mt-9 [&>:not(:first-child)]:ml-5">
                        <div>
                            <s className="font-medium text-3xl">1200</s>
                            <p className="mt-2.5">PLAYERS REGISTERED</p>
                        </div>
                        <div>
                            <s className="font-medium text-3xl">500</s>
                            <p className="mt-2.5">TEAMS NEED YOU</p>
                        </div>
                    </div>
                    <Button
                        styleType={'bordered'}
                        className="mt-10 max-w-fit text-sm sm:text-base !bg-[rgba(38,34,29,.8)]"
                    >
                        <img
                            src={'/arrow-down.png'}
                            className="mr-2"
                            alt="arrow down"
                        />
                        What&apos;s DDrace Team Searcher?
                    </Button>
                </div>
            </div>
            <AboutUs />
            <Reviews />
        </>
    );
}
