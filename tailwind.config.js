/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'paisbank-blue': '#0066ff',
        transaction: {
          adobe: '#9333ea',
          figma: '#9333ea',
          payment: '#22c55e',
          withdraw: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
        button: '0 2px 6px rgba(0, 102, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
