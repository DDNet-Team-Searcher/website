import { Input } from '@/components/ui/Input';
import type { StepProps } from '../types';
import { Button } from '@/components/ui/Button';
import { FieldErrors } from 'react-hook-form';
import { Step } from '@/components/Stepper/Step';

type OwnProps = StepProps<{ errors: FieldErrors }>;

export function Step1({ register, errors, setCurrentStep }: OwnProps) {
    return (
        <Step>
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
                        placeholder="Confirm password"
                    />
                </div>
                <Button
                    styleType={'filled'}
                    className="mt-9 ml-auto"
                    onClick={() => setCurrentStep(2)}
                    tabIndex={1}
                >
                    Next
                </Button>
            </div>
        </Step>
    );
}
