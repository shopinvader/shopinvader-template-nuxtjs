export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopinvader: {
        erp: {
          website_key: process.env.WEBSITE_KEY || '',
          api_url: process.env.ERP_HOST || '',
          default_role: 'default'
        },

        endpoint: 'shopinvader',
        elasticsearch: {
          url: 'https://index.demo14.shopinvader.com',
          indices: [
            {
              name: 'categories',
              index: 'demo_elasticsearch_backend_shopinvader_category',
              body: {}
            },
            {
              name: 'products',
              index: 'demo_elasticsearch_backend_shopinvader_variant',
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
    '~/plugins/shopinvader.ts'
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
