import type { Config } from 'tailwindcss'
const colors = require("tailwindcss/colors")
import daisyui from 'daisyui'
export default {
  content: [],
  plugins: [daisyui],
  theme: {
    extend: {
      fontFamily: {
        heading: "Josefin Sans",
      },
      colors: {
        slate: colors.slate,
        base: colors.neutral,
        primary: {
          DEFAULT: "#7E9A1B",
          50: "#fafce9",
          100: "#f2f8cf",
          200: "#e6f1a5",
          300: "#d1e571",
          400: "#bbd645",
          500: "#9ebc26",
          600: "#7e9a1b",
          700: "#5d7219",
          800: "#4b5b19",
          900: "#404d1a",
          950: "#202a09",
        },
        secondary: {
          DEFAULT: "#465F0D",
          50: "#F3FBE0",
          100: "#E4F6BC",
          200: "#C8EC75",
          300: "#ABE22D",
          400: "#7BA717",
          500: "#465F0D",
          600: "#394D0B",
          700: "#2C3B08",
          800: "#1E2906",
          900: "#111703",
          950: "#0A0E02",
        },
        info: {
          DEFAULT: "#FAC0BF",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FEEFEE",
          300: "#FCD8D7",
          400: "#FAC0BF",
          500: "#F8A8A7",
          600: "#F69091",
          700: "#F4787B",
          800: "#F36066",
          900: "#F14951",
          950: "#F03D47",
        },
        accent: {
          DEFAULT: "#E84E0F",
          50: "#FFFFFF",
          100: "#FFFAF7",
          200: "#FBD7C8",
          300: "#F8B498",
          400: "#F59168",
          500: "#F26E38",
          600: "#E84E0F",
          700: "#B33C0C",
          800: "#7F2B08",
          900: "#4A1905",
          950: "#301003",
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
