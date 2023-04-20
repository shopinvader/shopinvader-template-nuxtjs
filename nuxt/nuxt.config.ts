import eslintPlugin from 'vite-plugin-eslint'
export default defineNuxtConfig({
  vite: {
    plugins: [
      eslintPlugin({
        failOnError: false,
        cache: false,
        emitWarning: false,
        emitError: true
      })
    ]
  },
  css: ['@/assets/css/main.scss'],
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
      strapi: {
        url: process.env.STRAPI_URL || ''
      },
      auth: {
        authority: process.env.AUTH_AUTHORITY || '',
        client_id: process.env.AUTH_CLIENT_ID || '',
        response_type: 'code',
        scope: 'openid email',
        automaticSilentRenew: true
      },
      theme: {
        logo: process.env.VUE_APP_LOGO_URL || ''
      }
    }
  },
  modules: [
    '@nuxtjs/strapi',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  plugins: [
    '~/plugins/iconify.ts',
    '~/plugins/auth.client.ts',
    '~/plugins/shopinvader.ts',
    '~/plugins/shopinvader-cart.client.ts'
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },
  pages: true,
  imports: true,
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en_us',
        file: 'en-US.json'
      },
      {
        code: 'es',
        iso: 'fr_be',
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
    langDir: 'locales',
    defaultLocale: 'en'
  },
  build: {
    transpile: ['@shopinvader/cart']
  }
})
