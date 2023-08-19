import { Dispatch, SetStateAction, useState } from 'react';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useRegisterMutation } from '@/features/api/users.api';
import { hint } from '@/store/slices/hints';
import { ExcludeSuccess } from '@/types/Response.type';
import { RegisterUserResponse } from '@/types/api.type';
import { useForm } from 'react-hook-form';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from '@/components/Stepper';

type OwnProps = {
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;
}

export function Form({ currentStep, setCurrentStep }: OwnProps) {
    const [registerUser] = useRegisterMutation();
    const [userEmail, setUserEmail] = useState<null | string>(null);
    const dispatch = useAppDispatch();

    const defaultValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        tier: '0',
    };

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = async (values: typeof defaultValues) => {
        const { confirmPassword, ...data } = values;

        try {
            const res = await registerUser({
                ...data,
                tier: parseInt(data.tier),
            }).unwrap();

            if (res.status === 'success') {
                setCurrentStep(3);
                setUserEmail(values.email);
            }
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<RegisterUserResponse>;

            if (error.status === 'fail') {
                for (let [key, value] of Object.entries(error.data ?? {})) {
                    setError(key as keyof typeof error.data, {
                        message: value,
                    });
                }

                if ('message' in error && error.message !== undefined) {
                    dispatch(hint({ type: 'error', text: error.message }));
                }
                setCurrentStep(1);
            } else if (error.status === 'error') {
                dispatch(hint({ type: 'error', text: error.message }));
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[860px] mx-auto mt-[100px]"
        >
            <Stepper step={currentStep}>
                <Step1 register={register} setCurrentStep={setCurrentStep} errors={errors} />
                <Step2 register={register} setCurrentStep={setCurrentStep} />
                <Step3 userEmail={userEmail || ''} />
            </Stepper>
        </form>
    );
}
