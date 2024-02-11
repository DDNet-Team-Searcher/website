import { Header } from '@/components/Header';
import { Provider } from './provider';
import '@/styles/globals.css';
import { Hints } from '@/components/Hints';
import { RouteGuard } from '@/components/RouteGuard';
import { HappeningInfoModal } from '@/components/HappeningInfoModal';
import { BanModal } from './BanModal';
import { Footer } from '@/components/Footer/page';
import { getLocale } from '@/i18/server';
import { LocaleProvider } from '@/utils/hooks/localeProvider';

export const metadata = {
    title: 'DDnet Team Searcher',
    description:
        'Website where weirdos can find another weirdos to play with each other',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = getLocale();

    return (
        <Provider>
            <LocaleProvider value={locale}>
                <html lang={locale}>
                    <body className="bg-gradient-to-b from-[#181510] to-[#201506] flex flex-col min-h-[100vh]">
                        <BanModal />
                        <HappeningInfoModal />
                        <Header />
                        <Hints />
                        <RouteGuard>{children}</RouteGuard>
                        <Footer />
                    </body>
                </html>
            </LocaleProvider>
        </Provider>
    );
}
