import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type OwnProps = {
    currentStep: number;
    userEmail: string;
};

export function Step3({ currentStep, userEmail }: OwnProps) {
    const router = useRouter();

    const redirectToLoginPage = () => {
        router.push('/login');
    };

    return (
        <div
            style={{
                transform: `translateX(-${(currentStep - 1) * 100}%)`,
            }}
        >
            <div className="text-high-emphasis p-10 bg-[#24201A] rounded-[20px] mt-[200px]">
                <div className="flex items-center">
                    <div>
                        <p className="text-3xl font-medium">
                            Your account has been successfully created.
                        </p>
                        <p>
                            We(I) sent an email message to
                            {userEmail}. Go to link in message and verify your
                            account.(actually i didnt send any email but if i
                            will host it one day. i will be sending emails to
                            verify accounts)
                        </p>
                    </div>
                    <img src="/successful-register.png" />
                </div>
                <Button styleType={'filled'} onClick={redirectToLoginPage}>
                    Go to login page
                </Button>
            </div>
        </div>
    );
}
