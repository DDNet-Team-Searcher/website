import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextareaWithLabel } from "@/components/ui/TextareaWithLabel";
import { useBanUserMutation } from "@/features/api/users.api";
import { hint } from "@/store/slices/hints";
import { ExcludeSuccess } from "@/types/Response.type";
import { BanUserResponse } from "@/types/api.type";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { useHandleFormError } from "@/utils/hooks/useHandleFormError";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SubmitHandler, useForm } from "react-hook-form";

type OwnProps = {
    visible: boolean;
    onClose: () => void;
    userId: number;
}

type FormInput = {
    reason: string;
}

export function BanModal({ visible, onClose, userId }: OwnProps) {
    const dispatch = useAppDispatch();
    const [banUser] = useBanUserMutation();
    const handleFormError = useHandleFormError();
    const {
        register,
        handleSubmit,
        setError,
    } = useForm<FormInput>({
        defaultValues: {
            reason: ''
        }
    });

    const onSubmit: SubmitHandler<FormInput> = async ({ reason }) => {
        try {
            const response = await banUser({
                reason,
                userId
            }).unwrap();

            if (response.status === 'success') {
                dispatch(hint({ type: 'success', text: response.message || '' }));
                onClose();
            }
        } catch (err) {
            const error = (err as FetchBaseQueryError).data as ExcludeSuccess<BanUserResponse>;

            handleFormError(error, setError);
        }
    }

    return (
        <Modal visible={visible} onClose={onClose} width={'600px'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-5">
                    <p className="text-3xl m-0 pt-6">Ban a bitchass</p>
                    <TextareaWithLabel register={register('reason')} label="reason" className={{ container: "mt-5" }} />
                </div>
                <div className="flex justify-between mt-6 px-5 py-6 bg-[#1A1714] rounded-b-[10px]">
                    <Button styleType={'bordered'} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        styleType={'filled'}
                        type={'submit'}
                        className="!bg-error"
                    >
                        Ban
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
