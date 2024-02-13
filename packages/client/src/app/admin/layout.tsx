import { NoNameLayout } from '@/components/NoNameLayout';

type OwnProps = {
    children: React.ReactNode;
};

const urls = [
    {
        path: 'users',
        name: 'privileged.users',
    },
    {
        path: 'banned-users',
        name: 'privileged.banned_users',
    },
    {
        path: 'reports',
        name: 'privileged.reports',
    },
    {
        path: 'servers',
        name: 'privileged.servers',
    },
];

export default function AdminLayout({ children }: OwnProps) {
    return (
        <NoNameLayout title="privileged.title" urls={urls}>
            {children}
        </NoNameLayout>
    );
}
