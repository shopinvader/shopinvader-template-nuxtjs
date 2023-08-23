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
      theme: {
        logo: process.env.VUE_APP_LOGO_URL || ''
      },
      shopinvader: {
        erp: {
          key: process.env.NUXT_PUBLIC_SHOPINVADER_ERP_KEY || "",
          url: process.env.NUXT_PUBLIC_SHOPINVADER_ERP_URL || "",
          default_role: "default",
        },
        endpoint: "shopinvader",
        elasticsearch: {
          url: process.env.NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_URL || "",
          indices: {
            products:
              process.env
                .NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_PRODUCTS ||
              "",
            categories:
              process.env
                .NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_CATEGORIES ||
              "",
          },
        },
      },
    },
  },
  googleFonts: {
    families: {
      Montserrat: [300,400,600,700],
      'Josefin+Sans': [700],
    },
    download: true,
    stylePath: 'css/fonts.css'
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
    join(dir, 'modules/shopinvader'),
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',

  ],

  plugins: [
    join(dir, 'plugins/iconify.ts'),

  ],

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },

  pages: true,
  sitemap: {
    exclude: ['/cart', '/checkout', '/template/**', '/account', '/account/**']
  },
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en_us',
        file: 'en-US.json',
        name: 'English',
        icon: 'circle-flags:uk'
      },
      {
        code: 'es',
        iso: 'es_es',
        file: 'es-ES.json',
        name: 'Español',
        icon: 'circle-flags:es'
      },
      {
        code: 'fr',
        iso: 'fr_fr',
        file: 'fr-FR.json',
        name: 'Français',
        icon: 'circle-flags:fr'
      }
    ],
    debug: false,
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },
  build: {
    transpile: ['@shopinvader/cart']
  },
  devtools: {
    enabled: false
  },
  routeRules: {
    '/account/**': {
      index: false,
      ssr: false
    },
    '/cart': {
      index: false,
      ssr: false
    },
    '/checkout/**': {
      index: false,
      ssr: false
    },
    '/search': {
      index: false,
      ssr: false
    },
  }
})
