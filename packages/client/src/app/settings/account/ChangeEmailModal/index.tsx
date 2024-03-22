import { useUpdateEmailMutation } from '@/features/api/users.api';
import { UpdateEmailRespone } from '@app/shared/types/api.type';
import { ExcludeSuccess } from '@app/shared/types/Response.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { InputWithLabel } from '@/components/ui/InputWithLabel';
import { Modal } from '@/components/ui/Modal';
import { updateEmail as updateEmailInStore } from '@/store/slices/user';
import { useHandleFormError } from '@/utils/hooks/useHandleFormError';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export function ChangeEmailModal({ visible, onClose }: OwnProps) {
    const dispatch = useAppDispatch();
    const [updateEmail] = useUpdateEmailMutation();
    const handleFormError = useHandleFormError();

    const defaultValues = {
        email: '',
        password: '',
    };

    const {
        handleSubmit,
        setError,
        register,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues,
    });

    const onSubmit = async (data: typeof defaultValues) => {
        try {
            await updateEmail(data).unwrap();
            dispatch(updateEmailInStore(data.email));
            reset();
            onClose();
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<UpdateEmailRespone>;

            handleFormError(error, setError);
        }
    };

    return (
        <Modal onClose={onClose} visible={visible}>
            <div className="p-5">
                <p className="text-3xl text-center text-high-emphasis font-semibold">
                    Change your email
                </p>
                <p className="text-xs text-center text-medium-emphasis mt-4">
                    Enter a new email and your passord
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    id="change-email"
                    className="mt-10"
                >
                    <InputWithLabel
                        label="Email"
                        type="email"
                        register={register('email')}
                        errors={errors}
                    />
                    <InputWithLabel
                        label="Password"
                        register={register('password')}
                        className={{ container: 'mt-5' }}
                        errors={errors}
                    />
                </form>
            </div>
            <div className="flex justify-between mt-9 px-5 rounded-b-[10px] py-2.5 bg-primary-3">
                <Button styleType="bordered">Cancel</Button>
                <Button styleType="filled" type="submit" form="change-email">
                    Done
                </Button>
            </div>
        </Modal>
    );
}
