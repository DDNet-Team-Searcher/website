import { PlaceIcon } from '@/components/ui/Icons/Place';
import { Place as PlaceT } from '@app/shared/types/Happening.type';

type OwnProps = {
    place: PlaceT;
};

export function Place({ place }: OwnProps) {
    return (
        <div className="flex items-center font-medium mt-2.5">
            <PlaceIcon color="var(--medium-emphasis)" />
            <span className="ml-2.5 text-medium-emphasis text-sm">
                {place == 'THERE' ? 'Other place' : 'Our servers'}
            </span>
        </div>
    );
}
