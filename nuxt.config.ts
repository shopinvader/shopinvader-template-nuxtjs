import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const dir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
    }
  },
  css: ["~/assets/css/main.scss"],
  runtimeConfig: {
    basicAuth: process.env.NUXT_BASIC_AUTH || "",
    shopinvader: {
      erp: {
        proxy: {
          auth: process.env.NUXT_SHOPINVADER_ERP_PROXY_AUTH || "",
          url: process.env.NUXT_SHOPINVADER_ERP_PROXY_URL || "",
        },
      },
    },
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
        auth: {
          type: process.env.NUXT_PUBLIC_SHOPINVADER_AUTH_TYPR || "credentials",
          profile: {
            loginPage: "/account/login",
            logoutPage: "/",
          }
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
  modules: [
    "nuxt-delay-hydration",
    "nuxt-icon",
    '@nuxtjs/tailwindcss',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
    join(dir, 'modules/shopinvader'),
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/image',
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },
  delayHydration: {
    mode: "mount",

  },
  pages: true,
  sitemap: {
    exclude: ['/cart', '/checkout', '/template/**', '/account', '/account/**', '/_shopinvader']
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
      index: true,
      ssr: false
    },
  }
})
