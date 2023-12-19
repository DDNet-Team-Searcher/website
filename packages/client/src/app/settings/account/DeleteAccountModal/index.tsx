import { Modal } from '@/components/ui/Modal';

type OwnProps = {
    visible: boolean;
    onClose: () => void;
};

export function DeleteAccountModal({ visible, onClose }: OwnProps) {
    return (
        <Modal onClose={onClose} visible={visible}>
            <div>DELETE ACCOUNT MODAL</div>
        </Modal>
    );
}
