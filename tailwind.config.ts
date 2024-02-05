import type { Config } from 'tailwindcss'
const colors = require("tailwindcss/colors")
import daisyui from 'daisyui'
export default {
  content: [],
  plugins: [daisyui],
  theme: {
    extend: {
      fontFamily: {
        heading: "Montserrat",
      },
      colors: {
        slate: colors.slate,
        base: colors.neutral,
        primary: {
          DEFAULT: "#13263d",
          '50': '#f3f7fc',
          '100': '#e5eef9',
          '200': '#c6dcf1',
          '300': '#93bfe6',
          '400': '#599dd7',
          '500': '#3482c3',
          '600': '#2466a5',
          '700': '#1e5286',
          '800': '#1d466f',
          '900': '#1d3d5d',
          '950': '#13263d',
        },
        secondary: {
          DEFAULT: "#dca11d",
          '50': '#fcf9ea',
          '100': '#f9f2c8',
          '200': '#f4e294',
          '300': '#edcb57',
          '400': '#e6b429',
          '500': '#dca11d',
          '600': '#b87916',
          '700': '#935715',
          '800': '#7a4619',
          '900': '#693a1a',
          '950': '#3d1e0b',
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          fontFamily: 'Montserrat,"sanssecondaryerif"',
          primary: '#13263d',
          secondary: '#dca11d',
          accent: '#def2ff',
          neutral: '#42536d',
          'base-100': '#ffffff',
          info: '#0284c7',
          success: '#3EE581',
          warning: '#fde047',
          error: '#db2777',
          '--rounded-box': '0'
        }
      }
    ],
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: 'emerald'
  }
} satisfies Config
