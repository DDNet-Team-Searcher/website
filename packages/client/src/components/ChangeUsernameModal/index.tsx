import { useUpdateUsernameMutation } from '@/features/api/users.api';
import { UpdateUsernameResponse } from '@/types/api.type';
import { ExcludeSuccess } from '@/types/Response.type';
import { useAppDispatch } from '@/utils/hooks/hooks';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputWithLabel } from '../ui/InputWithLabel';
import { Modal } from '../ui/Modal';
import { updateUsername as updateUsernameInStore } from '@/store/slices/user';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export const ChangeUsernameModal = ({ visible, onClose }: OwnProps) => {
    const dispatch = useAppDispatch();
    const [updateUsername] = useUpdateUsernameMutation();

    const defaultValues = {
        username: '',
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
            await updateUsername(data).unwrap();
            dispatch(updateUsernameInStore(data.username));
            reset();
            onClose();
        } catch (err) {
            const error = (err as FetchBaseQueryError)
                .data as ExcludeSuccess<UpdateUsernameResponse>;

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
                    Change your username
                </p>
                <p className="text-xs text-center text-medium-emphasis mt-4">
                    Enter a new username and your passord
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    id="change-username"
                    className="mt-10"
                >
                    <InputWithLabel
                        label="Username"
                        register={register('username')}
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
                <Button styleType="filled" type="submit" form="change-username">
                    Done
                </Button>
            </div>
        </Modal>
    );
};
