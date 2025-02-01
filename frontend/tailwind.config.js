/** @type {import('tailwindcss').Config} */

export const content = [
    './src/**/*.{js,jsx,ts,tsx}', // Scan all files in the src folder
];

export const theme = {
    extend: {
        fontFamily: {
            velora: [
                '"Centra No2"',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ],
            Roboto: ['Roboto'],
            Poppins: ['Poppins'],
            Grotesk: ['Familjen Grotesk'],
        },
        backgroundImage: {
            'radial-logo': 'radial-gradient(circle, #FFD700, #68c9e9, #eaf7fc)',
            'radial-logo-vibrant': 'radial-gradient(circle, #48aadf, #00d4ff, #ffffff)',
            'radial-logo-soft': 'radial-gradient(circle, #48aadf, #b3dffc, #ffffff)',
        },
    },
};
export const plugins = [];
