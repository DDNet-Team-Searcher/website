import { Form } from './Form';

export default function Login() {
    return (
        <>
            <div className="bg-[url('/login-page-background.png')] mb-[150px] h-[1093px]">
                <div className="pt-[120px] w-fit mx-auto">
                    <p className="text-high-emphasis text-[40px]">
                        Login in your account
                        <br /> and{' '}
                        <span className="text-primary-1">something</span> will
                        happen.
                    </p>
                    <Form />
                </div>
            </div>
        </>
    );
}
