import { Dispatch, SetStateAction } from 'react';
import { UseFormRegister } from 'react-hook-form';

export type StepProps<T extends object = {}> = {
    setCurrentStep: Dispatch<SetStateAction<number>>;
    register: UseFormRegister<any>;
} & T;
