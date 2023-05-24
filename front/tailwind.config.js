module.exports = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // './*/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
