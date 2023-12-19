'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAppDispatch } from '@/utils/hooks/hooks';
import {
    useLazyGetCredentialsQuery,
    useLoginMutation,
} from '@/features/api/users.api';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ExcludeSuccess } from '@/types/Response.type';
import { LoginUserResponse } from '@/types/api.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { setIsAuthed } from '@/store/slices/user';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';

export function Form() {
    const [loginUser] = useLoginMutation();
    const [getCredentials] = useLazyGetCredentialsQuery();
    const router = useRouter();
    const defaultValues = { email: '', password: '', rememberMe: false };
    const dispatch = useAppDispatch();
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = useForm({ defaultValues });
    const handleFormError = useHandleFormError();

    const onSubmit = async (values: typeof defaultValues) => {
        const { rememberMe, ...data } = values;

        try {
            await loginUser(data).unwrap();

            dispatch(setIsAuthed(true));

            await getCredentials().unwrap();

            router.push('/');
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<LoginUserResponse>;

            handleFormError(error, setError);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-wrap mt-[100px] [&>*:not(:first-child)]:ml-[65px]">
                <Input
                    autoComplete={'off'}
                    register={register('email', {
                        required: 'Field is required',
                    })}
                    errors={errors}
                    placeholder={'Email'}
                />
                <Input
                    autoComplete={'off'}
                    register={register('password', {
                        required: 'Field is required',
                    })}
                    errors={errors}
                    placeholder={'Password'}
                    type={'password'}
                />
            </div>
            <Link
                href="/forgor-password"
                onClick={() => alert('Sucks to be you!')}
                className="mt-2.5 text-high-emphasis block"
            >
                Forgor password?
            </Link>
            <Button type={'submit'} styleType={'filled'} className="mt-[35px]">
                Login
            </Button>
        </form>
    );
}
