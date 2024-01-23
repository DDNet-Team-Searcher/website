import { NoNameLayout } from '@/components/NoNameLayout';

type OwnProps = {
    children: React.ReactNode;
};

const urls = [
    {
        path: 'roles',
        name: 'Roles',
    },
    {
        path: 'verified-users',
        name: 'Verified Users',
    },
    {
        path: 'banned-users',
        name: 'Banned Users',
    },
    {
        path: 'servers',
        name: 'Servers',
    },
    {
        path: 'servers-users',
        name: 'Servers',
    },
];

export default function AdminLayout({ children }: OwnProps) {
    return (
        <NoNameLayout title="Admin stuff" urls={urls}>
            {children}
        </NoNameLayout>
    );
}
