import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type OwnProps = {
    email: string;
};

export function RegistrationSuccessful({ email }: OwnProps) {
    const router = useRouter();

    const redirectToLoginPage = () => {
        router.push('/login');
    };

    return (
        <div className="text-high-emphasis p-10 bg-[#24201A] rounded-[20px] mt-[200px]">
            <div className="flex items-center">
                <div>
                    <p className="text-3xl font-medium">
                        Your account has been successfully created.
                    </p>
                    <p>
                        We sent an email to {email}. You have to open the link
                        from email to activate your account. Only then you will
                        be able to log in.
                    </p>
                </div>
                <img src="/successful-register.png" />
            </div>
            <Button styleType={'filled'} onClick={redirectToLoginPage}>
                Go to login page
            </Button>
        </div>
    );
}
