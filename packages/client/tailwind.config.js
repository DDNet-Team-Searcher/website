// this file is actually useless if you run nest but let it be here :\

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
            'primary-1': '#F6A740',
            'primary-2': '#26221D',
            'primary-3': '#383129',

            'high-emphasis': 'rgba(255, 255, 255, .87)',
            'medium-emphasis': 'rgba(255, 255, 255, .6)',
            'low-emphasis': 'rgba(255, 255, 255, .38)',

            success: '#46C46E',
            error: '#ED4245',
        },
    },
    plugins: [],
};
