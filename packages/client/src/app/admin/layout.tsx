import { NoNameLayout } from '@/components/NoNameLayout';

type OwnProps = {
    children: React.ReactNode;
};

const urls = [
    {
        path: 'users',
        name: 'Users',
    },
    {
        path: 'banned-users',
        name: 'Banned Users',
    },
    {
        path: 'reports',
        name: 'Reports',
    },
    {
        path: 'servers',
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
