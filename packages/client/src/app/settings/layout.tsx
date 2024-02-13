import { NoNameLayout } from '@/components/NoNameLayout';

type OwnProps = {
    children: React.ReactNode;
};

const urls = [
    {
        path: 'account',
        name: 'account.account',
    },
    {
        path: 'notifications',
        name: 'account.notifications',
    },
];

export default function SettingsLayout({ children }: OwnProps) {
    return (
        <NoNameLayout title="account.title" urls={urls}>
            {children}
        </NoNameLayout>
    );
}
