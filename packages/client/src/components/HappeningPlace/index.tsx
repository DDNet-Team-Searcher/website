import { Place } from '@/types/Happenings.type';

type OwnProps = {
    place: Place;
};

export const HappeningPlace: React.FC<OwnProps> = ({ place }) => {
    return (
        <div className="flex items-center font-semibold mt-2.5">
            <img src="/run-place.svg" />
            <span className="ml-2.5 text-medium-emphasis text-[12px]">
                {place == 'THERE' ? 'Other place' : 'Our servers'}
            </span>
        </div>
    );
};
