'use client';

import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
// import { Checkbox } from "../../components/Checkbox"
import { useAppDispatch } from "@/utils/hooks/hooks"
import { hint } from "@/store/slices/hints"
import { useLoginMutation } from "@/features/api/users.api"
//import { useRouter } from "next/router"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ExcludeSuccess } from "@/types/Response.type"
import { LoginUserResponse } from "@/types/api.type"
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query"
import { setIsAuthed } from "@/store/slices/user"

export default function Login() {
    const [loginUser] = useLoginMutation()
    const router = useRouter()
    const defaultValues = { email: '', password: '', rememberMe: false }
    const dispatch = useAppDispatch()
    const { handleSubmit, register, setError, formState: { errors } } = useForm({ defaultValues });

    const onSubmit = async (values: typeof defaultValues) => {
        const { rememberMe, ...data } = values

        try {
            await loginUser(data).unwrap()

            dispatch(setIsAuthed(true))
            router.push('/');
        } catch (err) {
            const error = (err as FetchBaseQueryError).data as ExcludeSuccess<LoginUserResponse>

            if (error.status === 'fail') {
                for (let [key, value] of Object.entries(error.data ?? {})) {
                    setError(key as keyof typeof error.data, { message: value });
                }

                if ("message" in error && error.message !== undefined) {
                    dispatch(hint({ type: "error", text: error.message }));
                }
            } else if (error.status === 'error') {
                dispatch(hint({ type: "error", text: error.message }));
            }

        }
    }

    return (
        <>
            <div className={`bg-[url("/login-page-background.png")] mb-[150px] h-[1093px]`}>
                <div className="pt-[120px] w-fit mx-auto">
                    <p className="text-high-emphasis text-[40px]">Login in your account<br /> and <span
                        className={"selected-text"}>something</span> will happen.</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-wrap mt-[100px] [&>*:not(:first-child)]:ml-[65px]">
                            <Input autoComplete={"off"} register={register('email', { required: 'Field is required' })} errors={errors} placeholder={"Email"} />
                            <Input autoComplete={"off"} register={register('password', { required: 'Field is required' })} errors={errors} placeholder={"Password"} type={"password"} />
                        </div>
                        <div className="mt-2.5 text-high-emphasis">
                            {
                                // <Field name={"rememberMe"} as={Checkbox} />
                            }
                            <span className="ml-2.5">Remember me</span>
                        </div>
                        <Link href="/forgor-password" onClick={() => alert("Sucks to be you!")} className="mt-2.5 text-high-emphasis block">Forgor password?</Link>
                        <Button type={"submit"} styleType={"filled"} className="mt-[35px]">Login</Button>
                    </form>
                </div>
            </div>
        </>
    )
}
