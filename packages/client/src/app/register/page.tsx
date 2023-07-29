'use client';

import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/features/api/users.api';
import { hint } from '@/store/slices/hints';
import { ExcludeSuccess } from '@/types/Response.type';
import { RegisterUserResponse } from '@/types/api.type';
import { useForm } from 'react-hook-form';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export default function Register() {
    const [registerUser] = useRegisterMutation();
    const [userEmail, setUserEmail] = useState<null | string>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [currentTierId, setCurrentTierId] = useState(0);
    const router = useRouter();
    const tiers: [string, string][] = [
        ['/voxel.png', 'F Tier'],
        ['/voxel.png', 'E Tier'],
        ['/voxel.png', 'D Tier'],
        ['/voxel.png', 'C Tier'],
        ['/voxel.png', 'B Tier'],
        ['/voxel.png', 'A Tier'],
        ['/voxel.png', 'S Tier ☠'],
    ];
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

    const onTierInputChange = (e: KeyboardEvent) => {
        let target = e.target as HTMLInputElement;
        const min = parseInt(target?.min);
        const max = parseInt(target?.max);
        const val = parseInt(target?.value);

        setCurrentTierId(val);

        target.style.backgroundSize =
            ((val - min) * 100) / (max - min) + '% 100%';
    };

    const redirectToLoginPage = () => {
        router.push('/login');
    };

    return (
        <>
            <div
                className={`mb-[150px] bg-[url("/register-page-background.png")] h-[1028px]`}
            >
                <div className={'pt-[120px] max-w-fit mx-auto'}>
                    <p
                        className={classNames('text-4xl text-high-emphasis', {
                            hidden: currentStep === 3,
                        })}
                    >
                        Create your account
                        <br /> and become the part of the{' '}
                        <s className="text-primary-1">community.</s>
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="max-w-[860px] mx-auto mt-[100px]"
                    >
                        <div
                            className={`flex overflow-hidden [&>*]:min-w-full [&>*]:transition-all`}
                        >
                            <div
                                style={{
                                    transform: `translateX(-${(currentStep - 1) * 100
                                        }%)`,
                                }}
                            >
                                {' '}
                                {/* First Step */}
                                <div className={'max-w-[600px] mx-auto'}>
                                    <div className={'flex justify-between'}>
                                        <Input
                                            autoComplete="off"
                                            classes={{
                                                container:
                                                    'max-w-[255px] w-full',
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
                                                container:
                                                    'max-w-[255px] w-full',
                                                input: 'w-full',
                                            }}
                                            errors={errors}
                                            register={register('email', {
                                                required: 'Field is required',
                                            })}
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div
                                        className={
                                            'flex justify-between mt-[60px]'
                                        }
                                    >
                                        <Input
                                            autoComplete="off"
                                            classes={{
                                                container:
                                                    'max-w-[255px] w-full',
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
                                                container:
                                                    'max-w-[255px] w-full',
                                                input: 'w-full',
                                            }}
                                            register={register(
                                                'confirmPassword',
                                                {
                                                    required:
                                                        'Field is required',
                                                },
                                            )}
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
                            </div>
                            <div
                                style={{
                                    transform: `translateX(-${(currentStep - 1) * 100
                                        }%)`,
                                }}
                            >
                                {' '}
                                {/* Second Step */}
                                <div className={'max-w-[600px] mx-auto'}>
                                    <div className={'tier-selection'}>
                                        <p
                                            className={
                                                'font-medium text-3xl mb-[70px] text-high-emphasis text-center'
                                            }
                                        >
                                            Select a tier you think in:
                                        </p>
                                        <div
                                            className={
                                                'relative max-w-[560px] mx-auto flex flex-col'
                                            }
                                        >
                                            <input
                                                type={'range'}
                                                {...register('tier', {
                                                    onChange: onTierInputChange,
                                                })}
                                                name={'tier'}
                                                step={1}
                                                min={0}
                                                max={6}
                                                className={
                                                    'max-w-[534px] w-full z-10 block mx-auto rounded-full bg-[#636363] bg-gradient-to-r from-primary-1 to-primary-1 bg-no-repeat bg-[length:0%_100%] h-[5px] appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-1'
                                                }
                                            />
                                            <div className="flex w-full justify-between mt-1">
                                                {tiers.map((thing, id) => (
                                                    <div
                                                        className="flex flex-col items-center"
                                                        key={id}
                                                    >
                                                        <p
                                                            className={classNames(
                                                                'text-low-emphasis text-[12px]',
                                                                {
                                                                    'text-primary-1':
                                                                        currentTierId ==
                                                                        id,
                                                                },
                                                            )}
                                                        >
                                                            {thing[1]}
                                                        </p>
                                                        <img
                                                            src={thing[0]}
                                                            alt="xD"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                'pt-[30px] text-high-emphasis'
                                            }
                                        >
                                            <p>
                                                Short description of{' '}
                                                {tiers[currentTierId][1]}:
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 0,
                                                })}
                                            >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipisicing elit. Ad
                                                animi aperiam consequuntur culpa
                                                delectus dignissimos error, esse
                                                est ex fuga illo iusto libero
                                                non quisquam sapiente tempore
                                                voluptates! Atque distinctio
                                                impedit iure molestiae
                                                necessitatibus quam quidem
                                                repudiandae. Assumenda atque
                                                autem corporis debitis deserunt
                                                dolorem illum itaque laudantium
                                                necessitatibus odio odit, quis
                                                quod rem, vel vero. Assumenda
                                                culpa error facilis harum
                                                laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 1,
                                                })}
                                            >
                                                esse est ex fuga illo iusto
                                                libero non quisquam sapiente
                                                tempore voluptates! Atque
                                                distinctio impedit iure
                                                molestiae necessitatibus quam
                                                quidem repudiandae. Assumenda
                                                atque autem corporis debitis
                                                deserunt dolorem illum itaque
                                                laudantium necessitatibus odio
                                                odit, quis quod rem, vel vero.
                                                Assumenda culpa error facilis
                                                harum laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 2,
                                                })}
                                            >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipisicing elit.
                                                autem corporis debitis deserunt
                                                dolorem illum itaque laudantium
                                                necessitatibus odio odit, quis
                                                quod rem, vel vero. Assumenda
                                                culpa error facilis harum
                                                laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 3,
                                                })}
                                            >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipisicing elit. Ad
                                                animi aperiam consequuntur culpa
                                                delectus dignissimos error, esse
                                                est ex fuga illo iusto libero
                                                non quisquam sapiente tempore
                                                voluptates! Atque distinctio
                                                impedit iure molestiae
                                                necessitatibus quam quidem
                                                repudiandae. Assumenda atque
                                                autem corporis debitis deserunt
                                                dolorem illum itaque laudantium
                                                necessitatibus odio odit, quis
                                                quod rem, vel vero. Assumenda
                                                culpa error facilis harum
                                                laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 4,
                                                })}
                                            >
                                                Lorem ipsum dolor sit a debitis
                                                deserunt dolorem illum itaque
                                                laudantium necessitatibus odio
                                                odit, quis quod rem, vel vero.
                                                Assumenda culpa error facilis
                                                harum laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 5,
                                                })}
                                            >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipisicing elit. Ad
                                                animi aperiam laudantium
                                                necessitatibus odio odit, quis
                                                quod rem, vel vero. Assumenda
                                                culpa error facilis harum
                                                laudantium nam odit optio
                                                temporibus ullam vitae? Autem
                                                cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p
                                                className={classNames({
                                                    hidden: currentTierId != 6,
                                                })}
                                            >
                                                Lorem ipsum dolor sit amet,
                                                consectetur adipisicing elit. Ad
                                                animi aperiam consequuntur culpa
                                                delectus dignissimos error, esse
                                                est e temporibus ullam vitae?
                                                Autem cupiditate illo maiores
                                                necessitatibus omnis? Alias
                                                delectus error excepturi
                                                exercitationem nemo perferendis,
                                                perspiciatis qui quia voluptas.
                                                Ad alias atque aut, delectus,
                                                expedita in inventore molestias
                                                nam neque odit perferendis,
                                                porro qui tenetur.
                                            </p>
                                            <p>
                                                If you will fucking try to
                                                choose much higher tier than you
                                                are. I will find your family. So
                                                dont do it. Save my and your
                                                time :)
                                            </p>
                                        </div>
                                        <div className="flex justify-between mt-[50px]">
                                            <Button
                                                styleType={'bordered'}
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type={'submit'}
                                                styleType={'filled'}
                                            >
                                                Finish!
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    transform: `translateX(-${(currentStep - 1) * 100
                                        }%)`,
                                }}
                            >
                                <div className="text-high-emphasis p-10 bg-[#24201A] rounded-[20px] mt-[200px]">
                                    <div className="flex items-center">
                                        <div>
                                            <p className="text-3xl font-medium">
                                                Your account successfully been
                                                created.
                                            </p>
                                            <p>
                                                We(I) sent an email message to{' '}
                                                {userEmail}. Go to link in
                                                message and verify your
                                                account.(actually i didnt send
                                                any email but if i will host it
                                                one day. i will be sending
                                                emails to verify accounts)
                                            </p>
                                        </div>
                                        <img src="/successful-register.png" />
                                    </div>
                                    <Button
                                        styleType={'filled'}
                                        onClick={redirectToLoginPage}
                                    >
                                        Go to login page
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
