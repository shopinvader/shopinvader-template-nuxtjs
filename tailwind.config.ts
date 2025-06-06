import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
export default {
  content: [],
  plugins: [daisyui],
  theme: {
    extend: {
      fontFamily: {
        heading: 'Open Sans',
        sans: 'Open Sans'
      },
      colors: {
        slate: colors.slate,
        base: colors.neutral,
        primary: {
          DEFAULT: '#13263d',
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
          '950': '#13263d'
        },
        secondary: {
          DEFAULT: '#dca11d',
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
          '950': '#3d1e0b'
        },
        accent: {
          DEFAULT: '#74253f',
          '50': '#fcf3f7',
          '100': '#f9eaf2',
          '200': '#f5d5e5',
          '300': '#efb2cf',
          '400': '#e482ae',
          '500': '#d75d90',
          '600': '#c43e70',
          '700': '#a92d58',
          '800': '#8c2849',
          '900': '#74253f',
          '950': '#471022'
        },
        success: {
          DEFAULT: '#0EA44D',
          50: '#CBFBCF',
          100: '#AFF8B7',
          200: '#77F38E',
          300: '#3FEE6D',
          400: '#13DD58',
          500: '#0EA44D',
          600: '#0C8849',
          700: '#096C42',
          800: '#075036',
          900: '#043427',
          950: '#03261D'
        }
      }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          'color-scheme': 'light',
          primary: '#13263d',
          secondary: '#dca11d',
          accent: '#74253f',
          success: '#0EA44D',
          neutral: '#291334',
          'base-100': '#f9f9f9',
          'base-200': '#efeae6',
          'base-300': '#e7e2df',
          'base-content': '#291334',
          '--rounded-btn': '1.9rem',
          '--tab-border': '2px',
          '--tab-radius': '0.7rem'
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
