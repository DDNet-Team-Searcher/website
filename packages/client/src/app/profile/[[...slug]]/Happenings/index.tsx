import { Happening } from '@/components/Happening';
import { useGetProfileHappeningsQuery } from '@/features/api/users.api';
import { mergeHappenings } from '@/store/slices/happenings';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useEffect, useState } from 'react';

type OwnProps = {
    userId: number;
};

export function Happenings({ userId }: OwnProps) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetProfileHappeningsQuery(userId);
    const [happeningsIds, setHappeningsIds] = useState<number[]>([]);

    useEffect(() => {
        if (data?.status === 'success') {
            const happenings = data.data.happenings;

            dispatch(mergeHappenings(happenings));
            setHappeningsIds(happenings.map((happening) => happening.id));
        }
    }, [isLoading]);

    return (
        <section className="flex flex-wrap gap-7 w-full mx-auto">
            <div className="w-full">
                {happeningsIds.map((happeningId) => (
                    <Happening key={happeningId} id={happeningId} />
                ))}
            </div>
        </section>
    );
}
