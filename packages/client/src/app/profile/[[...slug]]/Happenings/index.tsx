import { Happening } from '@/components/Happening';
import { Input } from '@/components/ui/Input';
import { useLazyGetProfileHappeningsQuery } from '@/features/api/users.api';
import { mergeHappenings } from '@/store/slices/happenings';
import { useAppDispatch } from '@/utils/hooks/hooks';
import {
    Happenings as EHappenings,
    Status,
} from '@app/shared/types/Happening.type';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type OwnProps = {
    userId: number;
};

type FormFields = {
    query: string;
    filters: {
        type: EHappenings | '';
        status: Status | '';
    };
};

const typeOptions = {
    Happenings: 'Happenings',
    [EHappenings.Run]: 'Runs',
    [EHappenings.Event]: 'Events',
};

const statusOptions = {
    [Status.NotStarted]: 'Not started',
    [Status.Happening]: Status.Happening,
    [Status.Finished]: Status.Finished,
};

export function Happenings({ userId }: OwnProps) {
    const dispatch = useAppDispatch();
    const [getHappenings] = useLazyGetProfileHappeningsQuery();
    const [happeningsIds, setHappeningsIds] = useState<number[]>([]);
    const { register, watch } = useForm<FormFields>({
        defaultValues: {
            query: '',
            filters: {
                type: '',
                status: '',
            },
        },
        mode: 'onChange',
    });

    useEffect(() => {
        getHappenings({ userId, params: {} })
            .unwrap()
            .then((data) => {
                if (data?.status === 'success') {
                    const happenings = data.data.happenings;

                    dispatch(mergeHappenings(happenings));
                    setHappeningsIds(
                        happenings.map((happening) => happening.id),
                    );
                }
            });
    }, []);

    const onSubmit = async (fields: FormFields) => {
        try {
            const params: Record<string, string> = {
                query: fields.query,
                ...fields.filters,
            };
            const data = await getHappenings({ userId, params }).unwrap();

            if (data?.status === 'success') {
                const happenings = data.data.happenings;

                dispatch(mergeHappenings(happenings));
                setHappeningsIds(happenings.map((happening) => happening.id));
            }
        } catch (e) {
            console.log('skill issue');
        }
    };

    useEffect(() => {
        watch((data) => {
            onSubmit(data as FormFields);
        });
    }, [watch]);

    return (
        <section>
            <form className="flex">
                <Input
                    register={register('query')}
                    classes={{ container: 'w-1/2', input: 'w-full' }}
                    placeholder="Happening you wanna find..."
                    showPlaceholder={false}
                    errors={{}}
                />
                <select
                    className="border-primary-3 border-[1px] px-3 py-2.5 bg-primary-2 rounded-[10px] text-high-emphasis ml-5"
                    {...register('filters.type')}
                >
                    <option value="" disabled>
                        Type
                    </option>
                    {Object.keys(typeOptions).map((key, id) => (
                        <option key={id} value={key}>
                            {typeOptions[key as keyof typeof typeOptions]}
                        </option>
                    ))}
                </select>
                <select
                    className="border-primary-3 border-[1px] px-3 py-2.5 bg-primary-2 rounded-[10px] text-high-emphasis ml-5"
                    {...register('filters.status')}
                >
                    <option value="" disabled>
                        Status
                    </option>
                    {Object.keys(statusOptions).map((key, id) => (
                        <option key={id} value={key}>
                            {statusOptions[key as keyof typeof statusOptions]}
                        </option>
                    ))}
                </select>
            </form>
            <div className="flex flex-wrap gap-7 mt-5">
                {happeningsIds.map((happeningId) => (
                    <Happening key={happeningId} id={happeningId} />
                ))}
            </div>
        </section>
    );
}
