import { useUpdatePasswordMutation } from '@/features/api/users.api';
import { UpdatePasswordResponse } from '@/types/api.type';
import { ExcludeSuccess } from '@/types/Response.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { InputWithLabel } from '@/components/ui/InputWithLabel';
import { Modal } from '@/components/ui/Modal';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export function ChangePasswordModal({ visible, onClose }: OwnProps) {
    const [updatePassword] = useUpdatePasswordMutation();
    const handleFormError = useHandleFormError();

    const defaultValues = {
        old: '',
        new: '',
        confirmNew: '',
    };

    const {
        handleSubmit,
        setError,
        register,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    const onSubmit = async (data: typeof defaultValues) => {
        try {
            if (data.new !== data.confirmNew) {
                setError('confirmNew', {
                    message: 'Passwords are not the same',
                });
                return;
            }
            const { confirmNew, ...data2 } = data;
            await updatePassword(data2).unwrap();
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<UpdatePasswordResponse>;

            handleFormError(error, setError);
        }
    };

    return (
        <Modal onClose={onClose} visible={visible}>
            <div className="p-5">
                <p className="text-3xl text-center text-high-emphasis font-semibold">
                    Change password
                </p>
                <p className="text-xs text-center text-medium-emphasis mt-4">
                    Enter a new password and your passord
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    id="change-password"
                    className="mt-10"
                >
                    <InputWithLabel
                        label="Current password"
                        register={register('old')}
                        errors={errors}
                    />
                    <InputWithLabel
                        label="New password"
                        register={register('new')}
                        className={{ container: 'mt-5' }}
                        errors={errors}
                    />
                    <InputWithLabel
                        label="Confirm new password"
                        register={register('confirmNew')}
                        className={{ container: 'mt-5' }}
                        errors={errors}
                    />
                </form>
            </div>
            <div className="flex justify-between mt-9 px-5 rounded-b-[10px] py-2.5 bg-primary-3">
                <Button styleType="bordered">Cancel</Button>
                <Button styleType="filled" type="submit" form="change-password">
                    Done
                </Button>
            </div>
        </Modal>
    );
};
