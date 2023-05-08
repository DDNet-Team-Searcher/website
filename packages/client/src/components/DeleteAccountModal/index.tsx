import { Modal } from '../ui/Modal';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export const DeleteAccountModal = ({ visible, onClose }: OwnProps) => {
    return (
        <Modal onClose={onClose} visible={visible}>
            <div>DELETE ACCOUNT MODAL</div>
        </Modal>
    );
};
