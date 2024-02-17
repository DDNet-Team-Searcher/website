import { NavbarLayout } from '@/components/NavbarLayout';
import { createTranslation } from '@/i18/server';

type OwnProps = {
    children: React.ReactNode;
};

export default async function AdminLayout({ children }: OwnProps) {
    const { t } = await createTranslation('navbar');

    const urls = [
        {
            path: '/admin/users',
            name: t('privileged.users'),
        },
        {
            path: '/admin/banned-users',
            name: t('privileged.banned_users'),
        },
        {
            path: '/admin/reports',
            name: t('privileged.reports'),
        },
        {
            path: '/admin/servers',
            name: t('privileged.servers'),
        },
    ];
    return (
        <NavbarLayout title={t('privileged.title')} urls={urls}>
            {children}
        </NavbarLayout>
    );
}
