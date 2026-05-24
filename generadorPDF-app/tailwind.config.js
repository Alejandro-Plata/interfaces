/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        tinta:     '#3a2b1a',
        pergamino: '#f5e6c8',
        sello:     '#8b1a1a',
      },
      fontFamily: {
        gothic: ['"Cinzel"', '"Palatino Linotype"', 'Georgia', 'serif'],
        scroll: ['"IM Fell English"', '"Palatino Linotype"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
