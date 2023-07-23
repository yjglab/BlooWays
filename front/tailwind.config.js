module.exports = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // './*/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Pretendard Variable', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
