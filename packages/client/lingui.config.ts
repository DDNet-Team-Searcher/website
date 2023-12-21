import { formatter } from "@lingui/format-po";
import { LinguiConfig } from "@lingui/conf";

const config: LinguiConfig = {
    locales: ["en", "cs", "uk", "ru", "pl"],
    catalogs: [
        {
            path: "src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    format: formatter({ explicitIdAsDefault: true }),
};

export default config;
