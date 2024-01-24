'use client';

import { Button } from "@/components/ui/Button";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const defaultColors = [
    '#e91e63',
    '#3498db',
    '#2ecc71',
    '#f1c40f',
    '#e67e22',
    '#c27c0e',
    '#546e7a',
    '#1f8b4c',
    '#11806a',
    '#1abc9c',
    '#607d8b',
    '#e74c3c',
    '#71368a',
    '#206694',
    '#9b59b6',
    '#a84300',
    '#ad1457',
    '#979c9f',
    '#992d22',
    '#95a5a6',
];

const permssions = [
    {
        name: "canManagePosts",
        description: "Allow owner of this role create, edit and delete posts."
    },
    {
        name: "canBanUsers",
        description: "Some other dum description"
    },
];

export default function RolePage() {
    const { register, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            name: "Daddy",
            color: "#99aab5",
            canManagePosts: true,
            canBanUsers: false,
            icon: null as File | null | string
        }
    });
    const [preview, setPreview] = useState<string | null>(null);
    const watchIcon = watch('icon');
    const ref = useRef<HTMLInputElement>(null);

    const setColor = (color: string): void => {
        setValue('color', color, { shouldDirty: true, shouldTouch: true });
    }

    useEffect(() => {
        if (watchIcon && typeof watchIcon !== "string") {
            setPreview(URL.createObjectURL(watchIcon));
        }
    }, [watchIcon]);

    const chooseImage = () => {
        ref.current?.click();
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setValue('icon', e.target.files[0]);
        }
    }

    //THIS IS PLANNED, NO WORRIES
    const onSubmit = (data: any) => {
        //send data
    }

    return (
        <div className="max-w-[450px]">
            <h2 className="text-high-emphasis text-[25px]">EDIT ROLE - DADDY</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-high-emphasis text-[20px] mt-5">Display</h3>
                <InputWithLabel register={register('name')} label="Role Name" required className={{ container: 'text-high-emphasis mt-4' }} />
                <div className="mt-4">
                    <p className='text-[12px] uppercase text-high-emphasis'>Role Color<span className="text-error">*</span></p>
                    <div className="h-12 flex mt-1">
                        <input type="color" className="max-w-[70px] appearance-none rounded-sm w-full h-full" {...register('color')} />
                        <div className="flex flex-wrap content-between">
                            {defaultColors.map((color, id) => (
                                <span key={id} className="block w-5 h-5 mx-2 rounded-sm cursor-pointer" style={{ backgroundColor: color }} onClick={() => setColor(color)} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <p className='text-[12px] uppercase text-high-emphasis'>Role Icon</p>
                    <div className="w-[70px] h-[48px]">
                        {preview ?
                            <img src={preview} className="w-full h-full rounded-sm object-cover" />
                            :
                            <span className="block w-full h-full bg-primary-3 rounded-sm"></span>
                        }
                    </div>
                    <input type="file" ref={ref} onChange={onChange} className="hidden" />
                    <Button styleType="filled" onClick={chooseImage} className="mt-2">Choose image</Button>
                </div>
                <h3 className="text-high-emphasis text-[20px] mt-5">Permissions</h3>
                <ul className="mt-2.5 [&>li:not(&>:first-child)]:mt-2">
                    {permssions.map((permission, id) => (
                        <li key={id}>
                            <div className="flex">
                                <input type="checkbox" {...register(permission.name as 'canBanUsers')} />
                                <p className="ml-2 text-high-emphasis">{permission.name}</p>
                            </div>
                            <p className="text-medium-emphasis">{permission.description}</p>
                        </li>
                    ))}
                </ul>
                <Button styleType="filled" className="mt-5">Save</Button>
            </form>
        </div>
    )
}
