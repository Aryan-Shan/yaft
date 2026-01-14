/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-black': '#050505',
                'brand-dark': '#0a0a0a',
                'neon-green': '#ccff00',
                'neon-pink': '#ff00ff',
                'neon-blue': '#00ffff',
                'neon-red': '#ff3333',
                'glass-white': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                'brand': ['Space Grotesk', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [],
}
