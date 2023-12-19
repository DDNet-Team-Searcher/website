import { hint } from '@/store/slices/hints';
import { Fail, ResError } from '@/types/Response.type';
import { UseFormSetError } from 'react-hook-form';
import { useAppDispatch } from './hooks';

export function useHandleFormError() {
    const dispatch = useAppDispatch();

    return (
        data: Fail<object> | ResError | Fail<null>,
        setError: UseFormSetError<object> | null = null,
    ) => {
        const error = data;

        if (error.status === 'fail') {
            if (setError) {
                for (let [key, value] of Object.entries(error.data ?? {})) {
                    setError(key as keyof typeof error.data, {
                        message: value,
                    });
                }
            }

            if ('message' in error && error.message !== undefined) {
                dispatch(hint({ type: 'error', text: error.message }));
            }
        } else if (error.status === 'error') {
            dispatch(hint({ type: 'error', text: error.message }));
        }
    };
}
