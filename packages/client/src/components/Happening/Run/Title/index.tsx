import { setHappeningInfoModalData } from '@/store/slices/app';
import { Happenings, Run } from '@app/shared/types/Happening.type';
import { useAppDispatch } from '@/utils/hooks/hooks';

type OwnProps = {
    title: string;
    run: Run;
};

export function Title({ title, run }: OwnProps) {
    const dispatch = useAppDispatch();

    const openHappeningInfoModal = () => {
        dispatch(
            setHappeningInfoModalData({
                type: Happenings.Run,
                happening: run,
                visible: true,
            }),
        );
    };

    return (
        <p
            className="mt-4 text-high-emphasis font-semibold cursor-pointer"
            onClick={openHappeningInfoModal}
        >
            {title}
        </p>
    );
}
