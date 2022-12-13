export default defineNuxtConfig({
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
          url: 'https://index.demo14.shopinvader.com',
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
      }
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  plugins: [
    '~/plugins/shopinvader.ts',
    '~/plugins/shopinvader-cart.client.ts',
  ],
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
        iso: 'fr_be',
        file: 'fr-FR.json'
      }
    ],
    debug: false,
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en'
  },
  build: {
    transpile: [
      '@shopinvader/cart'
    ]
  }
});
