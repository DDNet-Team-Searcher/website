import { NoNameLayout } from '@/components/NoNameLayout';

type OwnProps = {
    children: React.ReactNode;
};

const urls = [
    {
        path: 'account',
        name: 'Account',
    },
    {
        path: 'notifications',
        name: 'Notifications',
    },
];

export default function SettingsLayout({ children }: OwnProps) {
    return (
        <NoNameLayout title="User Settings" urls={urls}>
            {children}
        </NoNameLayout>
    );
}
