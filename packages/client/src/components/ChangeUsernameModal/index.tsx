import { useForm } from 'react-hook-form';
import { InputWithLabel } from '../ui/InputWithLabel';
import { Modal } from '../ui/Modal';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export const ChangeUsernameModal = ({ visible, onClose }: OwnProps) => {
    const defaultValues = {
        username: "",
        password: ""
    };

    const { handleSubmit, register } = useForm({
        defaultValues
    });

    const onSubmit = () => {
        console.log("LOL");
    }

    return (
        <Modal onClose={onClose} visible={visible}>
            <p>Change your username</p>
            <p>Enter a new username and your passord</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputWithLabel label='Username' register={register('username')} />
                <InputWithLabel label='Password' register={register('password')} />
            </form>
        </Modal>
    );
};
