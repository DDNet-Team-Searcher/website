import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RadioInput } from '@/components/ui/RadioInput';
import { TextareaWithLabel } from '@/components/ui/TextareaWithLabel';
import { useReportUserMutation } from '@/features/api/users.api';
import { hint } from '@/store/slices/hints';
import { ExcludeSuccess } from '@app/shared/types/Response.type';
import { ReportUserResponse } from '@app/shared/types/api.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
    userId: number;
};

type FormInput = {
    type: string;
    reason: string;
};

export function ReportModal({ visible, onClose, userId }: OwnProps) {
    const dispatch = useAppDispatch();
    const [isTextareaVisible, setIsTextareaVisible] = useState(false);
    const [reportUser] = useReportUserMutation();
    const handleFormError = useHandleFormError();
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isDirty },
    } = useForm<FormInput>({
        defaultValues: {
            type: '',
            reason: '',
        },
    });
    const inputValue = useWatch({ control, name: 'type' });
    const textareaValue = useWatch({ control, name: 'reason' });

    useEffect(() => {
        if (inputValue === 'other') {
            setIsTextareaVisible(true);
        } else {
            setIsTextareaVisible(false);
        }
    }, [inputValue]);

    useEffect(() => {
        if (
            (!Object.keys(errors).length &&
                inputValue !== 'other' &&
                isDirty) ||
            (inputValue === 'other' && textareaValue !== '')
        ) {
            setIsSubmitButtonDisabled(false);
        } else {
            setIsSubmitButtonDisabled(true);
        }
    }, [errors, isDirty, textareaValue]);

    const inputs = [
        {
            title: 'Spamming',
            value: 'spamming',
        },
        {
            title: 'Impersonation',
            value: 'impersonation',
        },
        {
            title: 'Harrasment',
            value: 'harrasment',
        },
        {
            title: 'Inappropriate content',
            value: 'inappropriate_content',
        },
        {
            title: 'Misinformation',
            value: 'misinformation',
        },
        {
            title: 'Other (write yourself)',
            value: 'other',
        },
    ];

    const onSubmit: SubmitHandler<FormInput> = async ({ type, reason }) => {
        let reportReason: string = '';

        if (type === 'other') {
            reportReason = reason;
        } else {
            reportReason = inputs.find((obj) => obj.value === type)!.title;
        }

        try {
            const response = await reportUser({
                reason: reportReason,
                userId,
            }).unwrap();

            if (response.status === 'success') {
                dispatch(
                    hint({ type: 'success', text: response.message || '' }),
                );
                onClose();
            }
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<ReportUserResponse>;

            handleFormError(error, setError);
        }
    };

    return (
        <Modal visible={visible} onClose={onClose} width={'600px'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-5">
                    <p className="text-3xl m-0 pt-6">Leave a report</p>
                    <div>
                        {inputs.map((val, id) => (
                            <div
                                className="flex items-center py-[10px] px-2.5 rounded-[5px] bg-primary-3 mt-5"
                                key={id}
                            >
                                <RadioInput
                                    title={'Our own servers.'}
                                    value={val.value}
                                    subtitle={
                                        'You will have less change to get ddosed.'
                                    }
                                    id={val.value}
                                    register={register('type', {
                                        required: true,
                                    })}
                                    className={{ wrapper: 'mt-5' }}
                                />
                                <label
                                    htmlFor={val.value}
                                    className={classNames('ml-2.5 grow-[1]')}
                                >
                                    <p className={'font-medium'}>{val.title}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                    {isTextareaVisible && (
                        <TextareaWithLabel
                            register={register('reason')}
                            label="reason"
                            className={{ container: 'mt-5' }}
                        />
                    )}
                </div>
                <div className="flex justify-between mt-6 px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                    <Button styleType={'bordered'} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        styleType={'filled'}
                        type={'submit'}
                        className="!bg-error"
                        disabled={isSubmitButtonDisabled}
                    >
                        Report
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
