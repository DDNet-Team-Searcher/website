module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-up': {
                    '0%': {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'translateY(-100%)',
                        opacity: '0',
                    },
                },
                'fade-down': {
                    '0%': {
                        transform: 'translateY(100%)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                },
            },
        },
        colors: {
            'primary-1': 'var(--app-primary-1)',
            'primary-2': '#26221D',
            'primary-3': '#383129',

            'high-emphasis': 'rgba(255, 255, 255, .87)',
            'medium-emphasis': 'rgba(255, 255, 255, .6)',
            'low-emphasis': 'rgba(255, 255, 255, .38)',

            success: 'var(--app-success)',
            error: 'var(--app-error)',
        },
    },
    plugins: [],
};
