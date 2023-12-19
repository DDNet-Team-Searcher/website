'use client';

import { Modal } from '@/components/ui/Modal';
import { useAppSelector } from '@/utils/hooks/hooks';

export function BanModal() {
    const banned = useAppSelector((state) => state.user.user.banned);

    if (banned.isBanned) {
        return (
            <Modal width={'500px'} visible={true} onClose={() => {}}>
                <div className="p-6">
                    <p className="text-3xl">Heyho cowboy, not that fast.</p>
                    <p className="text-xl mt-5">
                        Seems like yo ass was banned and the reason is
                    </p>
                    <p className="text-2xl font-bold mt-2">
                        {banned.reason || 'No reason was provided :D'}
                    </p>
                    <p className="text-sm mt-2">
                        Time to beg for being unbanned or get yo ass outta here.
                    </p>
                </div>
            </Modal>
        );
    }
}
