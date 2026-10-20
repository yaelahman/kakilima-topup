import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                'primary-dark': 'var(--primary-dark)',
                'primary-soft': 'var(--primary-soft)',
                primaryRgb: 'var(--primary-rgb)',
                secondary: 'var(--secondary)',
                secondaryRgb: 'var(--secondary-rgb)',
                base: 'var(--base)',
            },
            fontFamily: {
                sans: ['var(--font-plus-jakarta)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
                display: ['var(--font-sora)', 'var(--font-plus-jakarta)', 'ui-sans-serif', 'system-ui'],
                mono: ['var(--font-geist-mono)'],
            },
            boxShadow: {
                'brand': '0 10px 30px -10px rgba(var(--primary-rgb), 0.35)',
                'brand-lg': '0 20px 40px -12px rgba(var(--primary-rgb), 0.4)',
            },
        },
    },
    plugins: [],
};

export default config;
