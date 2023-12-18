'use client';

import { Avatar } from '@/components/Avatar';
import { ChangeEmailModal } from './ChangeEmailModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { ChangeUsernameModal } from './ChangeUsernameModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { Button } from '@/components/ui/Button';
import { useUpdateAvatarMutation } from '@/features/api/users.api';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/hooks';
import { useRef, useState } from 'react';
import { updateAvatar as updateAvatarInStore } from '@/store/slices/user';

export default function Account() {
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLInputElement>(null);
    const [updateAvatar] = useUpdateAvatarMutation();
    const [isChangeUsernameModalVisible, setIsChangeUsernameModalVisible] =
        useState(false);
    const [isChangeEmailModalVisible, setIsChangeEmailModalVisible] =
        useState(false);
    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
        useState(false);
    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
        useState(false);
    const user = useAppSelector((state) => state.user.user);

    const changeAvatar = () => {
        ref.current?.click();
    };

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target?.files?.length) {
                const formData = new FormData();

                formData.append('avatar', e.target?.files[0]);

                const res = await updateAvatar(formData).unwrap();
                if (res.status === 'success') {
                    dispatch(updateAvatarInStore(res.data.avatar));
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const changeUsername = () => {
        setIsChangeUsernameModalVisible(true);
    };

    const changeEmail = () => {
        setIsChangeEmailModalVisible(true);
    };

    const changePassword = () => {
        setIsChangePasswordModalVisible(true);
    };

    const deleteAccount = () => {
        setIsDeleteAccountModalVisible(true);
    };

    return (
        <>
            <ChangeUsernameModal
                visible={isChangeUsernameModalVisible}
                onClose={() => setIsChangeUsernameModalVisible(false)}
            />
            <ChangeEmailModal
                visible={isChangeEmailModalVisible}
                onClose={() => setIsChangeEmailModalVisible(false)}
            />
            <ChangePasswordModal
                visible={isChangePasswordModalVisible}
                onClose={() => setIsChangePasswordModalVisible(false)}
            />
            <DeleteAccountModal
                visible={isDeleteAccountModalVisible}
                onClose={() => setIsDeleteAccountModalVisible(false)}
            />
            <div className="flex items-center">
                <div className="relative">
                    <Avatar
                        src={user.avatar}
                        username={user.username || ''}
                        size={200}
                    />
                    <input
                        ref={ref}
                        type="file"
                        onChange={onChange}
                        className="hidden"
                    />
                    <div
                        className="hover:opacity-100 transition-opacity duration-300 select-none opacity-0 rounded-full inset-0  absolute uppercase flex justify-center items-center bg-[#000]/70 text-high-emphasis text-2xl font-medium cursor-pointer"
                        onClick={changeAvatar}
                    >
                        Change
                        <br /> Avatar
                    </div>
                </div>
                <div className="grow ml-7 bg-primary-2 p-5 rounded-[10px]">
                    <div className="flex w-full justify-between">
                        <div>
                            <p className="uppercase font-semibold text-[12px] text-medium-emphasis">
                                username
                            </p>
                            <p className="text-high-emphasis">
                                {user.username}
                            </p>
                        </div>
                        <Button
                            styleType={'filled'}
                            onClick={changeUsername}
                            className="text-sm"
                        >
                            Edit
                        </Button>
                    </div>
                    <div className="flex w-full justify-between mt-7">
                        <div>
                            <p className="uppercase font-semibold text-[12px] text-medium-emphasis">
                                email
                            </p>
                            <p className="text-high-emphasis">{user.email}</p>
                        </div>
                        <Button
                            styleType={'filled'}
                            onClick={changeEmail}
                            className="text-sm"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-[50px]">
                <p className="text-xl text-high-emphasis">
                    Password and Authentication
                </p>
                <Button
                    styleType="filled"
                    onClick={changePassword}
                    className="text-sm mt-5"
                >
                    Change Password
                </Button>
            </div>
            <div className="mt-[50px]">
                <p className="text-xl text-high-emphasis">Account removal</p>
                <p className="text-sm text-medium-emphasis">
                    If you remove your account it’s gg. You wont be able to
                    restore it!
                </p>
                <Button
                    styleType="filled"
                    onClick={deleteAccount}
                    className="text-sm mt-5 !bg-error"
                >
                    Delete Account
                </Button>
            </div>
        </>
    );
}
