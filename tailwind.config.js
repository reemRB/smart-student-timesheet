const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.resolve(__dirname, 'src/**/*.{html,ts}'),
  ],
  theme: {
    extend: {
      listStyleType: {
        'lower-alpha': 'lower-alpha',
        'upper-roman': 'upper-roman',
      },
      screens: {
        xs: '350px',
        sm: '550px',
        md: '950px',
        lg: '1050px',
        xl: '1300px',
        '2xl': '1600px',
        '3xl': '2000px',
      },
      colors: {
        primary: '#354958',
        blue: '#319BEC',
        grey: {
          dark: '#7E919F',
          light: '#F8F8F8'
        },
        red: '#FF423F',
        orange: '#FFAF38',
        green: '#83C60F',
        white: '#FFFFFF',
      },
    },
    fontFamily: {
      inter: ['"Inter"', 'sans-serif'],
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const fontWeights = {
        '.font-light': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '300',
        },
        '.font-regular': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '400',
        },
        '.font-medium': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '500',
        },
        '.font-semi': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '600',
        },
        '.font-bold': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '700',
        },
        '.font-extraBold': {
          'font-family': theme('fontFamily.inter'),
          'font-weight': '800',
        },
      };

      addUtilities(fontWeights, ['responsive', 'hover']);
    },
  ],
};
