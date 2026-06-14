/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html","./js/**/*.js"],
  safelist: [
    "",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    extend: {
      colors: {

      },
      fontFamily: {

      },
      fontSize:{
        xxs: '0.625rem',
        md: '0.938rem'
      }

    },
  },
  plugins: [],
}

