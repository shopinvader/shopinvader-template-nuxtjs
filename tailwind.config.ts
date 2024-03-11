import type { Config } from 'tailwindcss'
const colors = require("tailwindcss/colors")
import daisyui from 'daisyui'
export default {
  content: [],
  plugins: [daisyui],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Josefin Sans"],
      },
      colors: {
        slate: colors.slate,
        base: colors.neutral,
        primary: {
          DEFAULT: "#ebb624",
          '50': '#fdfae9',
          '100': '#faf3c7',
          '200': '#f7e491',
          '300': '#f1ce53',
          '400': '#ebb624',
          '500': '#dca016',
          '600': '#c17d11',
          '700': '#975811',
          '800': '#7d4616',
          '900': '#6b3a18',
          '950': '#3e1e0a',
        },
        secondary: {
          DEFAULT: "#888a85",
          '50': '#f6f7f6',
          '100': '#e3e4e3',
          '200': '#c8c9c6',
          '300': '#a4a6a2',
          '400': '#888a85',
          '500': '#676963',
          '600': '#51534e',
          '700': '#424441',
          '800': '#373936',
          '900': '#303130',
          '950': '#191a19',
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
