import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const dir = dirname(fileURLToPath(import.meta.url))
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
    }
  },
  css: [join(dir, './assets/css/main.scss')],
  runtimeConfig: {
    public: {
      shopinvader: {
        erp: {
          website_key: process.env.ERP_WEBSITE_KEY || '',
          api_url: process.env.ERP_HOST || '',
          default_role: 'default'
        },

        endpoint: 'shopinvader',
        elasticsearch: {
          url: process.env.ELASTIC_URL || '',
          indices: [
            {
              name: 'categories',
              index: process.env.ELASTIC_CATEGORY || '',
              body: {}
            },
            {
              name: 'products',
              index: process.env.ELASTIC_PRODUCT || '',
              body: {}
            }
          ]
        }
      },
      theme: {
        logo: process.env.VUE_APP_LOGO_URL || ''
      }
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],

  plugins: [
    join(dir, 'plugins/iconify.ts'),
    join(dir, 'plugins/shopinvader-services/custom-type.ts'),
    join(dir, 'plugins/shopinvader-services/index.ts')
  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },

  pages: true,

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'fr_fr',
        file: 'en-US.json'
      },
      {
        code: 'es',
        iso: 'fr_fr',
        file: 'es-ES.json'
      },
      {
        code: 'fr',
        iso: 'fr_fr',
        file: 'fr-FR.json'
      }
    ],
    debug: false,
    lazy: true,
    //langDir: join(dir, './locales'),
    langDir: 'locales',
    defaultLocale: 'en'
  },

  build: {
    transpile: ['@shopinvader/cart']
  },
  devtools: {
    enabled: false
  }
})
