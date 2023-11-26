'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { useEffect, useState } from 'react';

i18n.loadAndActivate({ locale: 'default', messages: {} });

const supportedLocales = ['en', 'uk', 'ru'];

export function Provider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<string | null>(null);

    useEffect(() => {
        if (navigator && navigator?.language && supportedLocales.includes(navigator.language)) {
            setLocale(navigator.language);
        } else {
            setLocale('en');
        }
    }, []);

    useEffect(() => {
        if (locale) {
            import(`@/locales/${locale}/messages`).then(({ messages }) => {
                i18n.loadAndActivate({ locale, messages });
            });
        }
    }, [locale]);

    return (
        <ReduxProvider store={store}>
            <I18nProvider i18n={i18n}>
                {children}
            </I18nProvider>
        </ReduxProvider>
    );
}
