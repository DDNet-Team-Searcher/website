import { NavbarLayout } from '@/components/NavbarLayout';
import { createTranslation } from '@/i18/server';

type OwnProps = {
    children: React.ReactNode;
};

export default async function SettingsLayout({ children }: OwnProps) {
    const { t } = await createTranslation('navbar');

    const urls = [
        {
            path: '/settings/account',
            name: t('account.account'),
        },
        {
            path: '/settings/notifications',
            name: t('account.notifications'),
        },
    ];
    return (
        <NavbarLayout title={t('account.title')} urls={urls}>
            {children}
        </NavbarLayout>
    );
}
