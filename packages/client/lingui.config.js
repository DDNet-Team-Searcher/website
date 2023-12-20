/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    locales: ["en", "cs", "uk", "ru", "pl"],
    catalogs: [
        {
            path: "src/locales/{locale}/messages",
            include: ["src"],
        },
    ],
    format: "po",
};
