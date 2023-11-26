'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages as enMessages } from "@/locales/en/messages";
//import { messages as czMessages } from "@/locales/cz/messages";
import { messages as ukMessages } from "@/locales/uk/messages";
import { messages as ruMessages } from "@/locales/ru/messages";
import { useEffect } from 'react';

i18n.load("en", enMessages);
//i18n.load("cz", czMessages);
i18n.load("uk", ukMessages);
i18n.load("ru", ruMessages);
i18n.activate("en");

//TODO: it looks like trash but it gets job done, y'know

export function Provider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (navigator?.language) {
            i18n.activate(navigator.language);
        }
    }, []);

    return (
        <ReduxProvider store={store}>
            <I18nProvider i18n={i18n}>
                {children}
            </I18nProvider>
        </ReduxProvider>
    );
}
