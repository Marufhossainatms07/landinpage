// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0057d0',
        secondary: '#6D7F9A',
      },
      fontFamily: {
        bangla: ['"Baloo Da 2"', 'cursive'],
      },
      boxShadow: {
        'payment-card': '0 4px 6px -1px rgb(0 87 208 / 0.05), 0 2px 4px -2px rgb(0 87 208 / 0.05)',
      }
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
}