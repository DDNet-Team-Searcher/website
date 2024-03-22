import { useRegisterMutation } from '@/features/api/users.api';
import { ExcludeSuccess } from '@app/shared/types/Response.type';
import { RegisterUserResponse } from '@app/shared/types/api.type';
import { useForm } from 'react-hook-form';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dispatch, SetStateAction } from 'react';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';

type OwnProps = {
    next: (() => void) | null;
    setEmail: Dispatch<SetStateAction<string>>;
};

type FormFields = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export function Form({ next, setEmail }: OwnProps) {
    const [registerUser] = useRegisterMutation();
    const handleFormError = useHandleFormError();

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: FormFields) => {
        const { confirmPassword, ...data } = values;

        try {
            const res = await registerUser(data).unwrap();

            if (res.status === 'success' && next) {
                setEmail(values.email);
                next();
            }
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<RegisterUserResponse>;

            handleFormError(error, setError);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[100px]">
            <div className={'max-w-[600px] mx-auto'}>
                <div className={'flex justify-between'}>
                    <Input
                        autoComplete="off"
                        classes={{
                            container: 'max-w-[255px] w-full',
                            input: 'w-full',
                        }}
                        errors={errors}
                        register={register('username', {
                            required: 'Field is reqired',
                        })}
                        placeholder="Username"
                    />
                    <Input
                        autoComplete="off"
                        classes={{
                            container: 'max-w-[255px] w-full',
                            input: 'w-full',
                        }}
                        errors={errors}
                        register={register('email', {
                            required: 'Field is required',
                        })}
                        placeholder="Email"
                    />
                </div>
                <div className={'flex justify-between mt-[60px]'}>
                    <Input
                        autoComplete="off"
                        classes={{
                            container: 'max-w-[255px] w-full',
                            input: 'w-full',
                        }}
                        register={register('password', {
                            required: 'Field is required',
                        })}
                        errors={errors}
                        type="password"
                        placeholder="Password"
                    />
                    <Input
                        autoComplete="off"
                        classes={{
                            container: 'max-w-[255px] w-full',
                            input: 'w-full',
                        }}
                        register={register('confirmPassword', {
                            required: 'Field is required',
                        })}
                        errors={errors}
                        type="password"
                        placeholder="Confirm password"
                    />
                </div>
                <Button
                    styleType="filled"
                    type="submit"
                    className="mt-9 ml-auto"
                >
                    Register
                </Button>
            </div>
        </form>
    );
}
