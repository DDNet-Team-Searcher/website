import { Header } from '@/components/Header';
import { store } from '@/store';
import { Hints } from '@/components/Hints';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { RouteGuard } from '@/components/RouteGuard';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Header />
            <Hints />
            <RouteGuard>
                <Component {...pageProps} />
            </RouteGuard>
        </Provider>
    );
}
