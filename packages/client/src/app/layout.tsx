import { Header } from '@/components/Header';
import { Provider } from './provider';
import '@/styles/globals.css';
import { Hints } from '@/components/Hints';
import { RouteGuard } from '@/components/RouteGuard';
import { HappeningInfoModal } from '@/components/HappeningInfoModal';

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
    return (
        <Provider>
            <html lang="en">
                <body className="bg-gradient-to-b from-[#181510] to-[#201506]">
                    <HappeningInfoModal
                        // happeningId={happeningInfoModalData.happeningId}
                        // onClose={onClose}
                        // type={happeningInfoModalData.type}
                        // visible={happeningInfoModalData.visible}
                    />
                    <Header />
                    <Hints />
                    <RouteGuard>{children}</RouteGuard>
                </body>
            </html>
        </Provider>
    );
}
