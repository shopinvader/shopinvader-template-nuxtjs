import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
export default {
  content: [],
  plugins: [daisyui],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          fontFamily: 'Montserrat,"sanssecondaryerif"',
          primary: '#2f64aa',
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
