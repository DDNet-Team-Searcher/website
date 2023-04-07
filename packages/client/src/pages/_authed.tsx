import { Events } from '@/components/Events';
import { HappeningInfoModal } from '@/components/HappeningInfoModal';
import { Runs } from '@/components/Runs';
import { setHappeningInfoModalData } from '@/store/slices/app';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';

export default function Authed() {
    const dispatch = useAppDispatch();
    const happeningInfoModalData = useAppSelector(
        (state) => state.app.happeningInfoModal,
    );

    const onClose = () => {
        dispatch(
            setHappeningInfoModalData({
                type: null,
                happeningId: null,
                visible: false,
            }),
        );
    };

    return (
        <div className="max-w-[1110px] mx-auto">
            {/*
            <div className="text-[white]">
                And that&apos;s an authed page 0_o
            </div>
            */}
            <HappeningInfoModal
                happeningId={happeningInfoModalData.happeningId}
                onClose={onClose}
                type={happeningInfoModalData.type}
                visible={happeningInfoModalData.visible}
            />
            <Events />
            <Runs />
        </div>
    );
}
