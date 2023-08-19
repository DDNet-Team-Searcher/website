import { useState } from 'react';
import type { StepProps } from '../types';
import classNames from 'classnames';
import { Button } from '@/components/ui/Button';
import { Step } from '@/components/Stepper/Step';

const tiers = [
    {
        url: '/voxel.png',
        name: 'F Tier',
        description: 'You have to be as bad as me',
    },
    {
        url: '/voxel.png',
        name: 'E Tier',
        description: 'Be a bit better than me lmao',
    },
    {
        url: '/voxel.png',
        name: 'D Tier',
        description: 'Be a bit better than me lmao',
    },
    {
        url: '/voxel.png',
        name: 'C Tier',
        description: 'Be a bit better than me lmao',
    },
    {
        url: '/voxel.png',
        name: 'B Tier',
        description: 'Be a bit better than me lmao',
    },
    {
        url: '/voxel.png',
        name: 'A Tier',
        description: 'Be a bit better than me lmao',
    },
    {
        url: '/voxel.png',
        name: 'S Tier 💀',
        description: 'Be a bit better than me lmao',
    },
];

type OwnProps = StepProps;

export function Step2({ setCurrentStep, register }: OwnProps) {
    const [currentTierId, setCurrentTierId] = useState(0);

    const onTierInputChange = (e: KeyboardEvent) => {
        let target = e.target as HTMLInputElement;
        const min = parseInt(target.min);
        const max = parseInt(target.max);
        const val = parseInt(target.value);

        setCurrentTierId(val);

        target.style.backgroundSize =
            ((val - min) * 100) / (max - min) + '% 100%';
    };

    return (
        <Step>
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
                            {tiers.map((tier, id) => (
                                <div
                                    className="flex flex-col items-center"
                                    key={id}
                                >
                                    <p
                                        className={classNames(
                                            'text-low-emphasis text-[12px]',
                                            {
                                                'text-primary-1':
                                                    currentTierId == id,
                                            },
                                        )}
                                    >
                                        {tier.name}
                                    </p>
                                    <img src={tier.url} alt="xD" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'pt-[30px] text-high-emphasis'}>
                        <p>Short description of {tiers[currentTierId].name}:</p>
                        {tiers.map((tier, id) => (
                            <p
                                className={classNames('mt-4', {
                                    hidden: currentTierId != id,
                                })}
                            >
                                {tier.description}
                            </p>
                        ))}
                        <p className='mt-2'>
                            You better dont try to fool me. Or I will... I
                            will.. I will do something. So ye, dont even try
                        </p>
                    </div>
                    <div className="flex justify-between mt-[50px]">
                        <Button
                            styleType={'bordered'}
                            onClick={() => setCurrentStep(1)}
                        >
                            Back
                        </Button>
                        <Button type={'submit'} styleType={'filled'}>
                            Finish!
                        </Button>
                    </div>
                </div>
            </div>
        </Step>
    );
}
