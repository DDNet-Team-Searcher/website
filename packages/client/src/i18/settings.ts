import type { InitOptions } from 'i18next';

export const FALLBACK_LOCALE = 'en';
export const supportedLocales = ['en'] as const;
export type Locales = (typeof supportedLocales)[number];
export const LANGUAGE_COOKIE = 'preferred_language';

export function getOptions(
    lang = FALLBACK_LOCALE,
    ns: string | string[] = 'common',
): InitOptions {
    return {
        // debug: true, Enable this if translations broke
        interpolation: {
            escapeValue: false,
            format: (value, format, lang) => {
                if (format === 'intlDateTime') {
                    return new Intl.DateTimeFormat(lang, {
                        month: 'short',
                        weekday: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    }).format(value);
                }

                return value;
            },
        },
        supportedLngs: supportedLocales,
        fallbackLng: FALLBACK_LOCALE,
        lng: lang,
        ns,
    };
}
