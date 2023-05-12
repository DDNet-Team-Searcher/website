import { useUpdateEmailMutation } from '@/features/api/users.api';
import { UpdateEmailRespone } from '@/types/api.type';
import { ExcludeSuccess } from '@/types/Response.type';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputWithLabel } from '../ui/InputWithLabel';
import { Modal } from '../ui/Modal';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export const ChangeEmailModal = ({ visible, onClose }: OwnProps) => {
    const [updateEmail] = useUpdateEmailMutation();

    const defaultValues = {
        email: '',
        password: '',
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
            await updateEmail(data).unwrap();
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<UpdateEmailRespone>;

            if (error.status === 'fail') {
                if (Object.keys(error.data)) {
                    Object.keys(error.data).map((key) => {
                        setError(key as keyof typeof error.data, {
                            message: error.data[key as keyof typeof error.data],
                        });
                    });
                }
            }
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
};
