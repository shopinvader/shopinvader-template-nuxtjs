import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
const dir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  delayHydration: {
    mode: 'mount'
  },
  app: {
    head: {
      templateParams: {
        separator: "|",
        siteName: "Shopinvader Demo",
      },
      titleTemplate: "%s %separator %siteName",
      link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }]
    }
  },
  css: ['~/assets/css/main.scss'],
  runtimeConfig: {
    // Serveur-side only configuration
    basicAuth: process.env.NUXT_BASIC_AUTH || '',
    shopinvader: {
      erp: {
        proxy: {
          auth: process.env.NUXT_SHOPINVADER_ERP_PROXY_AUTH || '',
          url: process.env.NUXT_SHOPINVADER_ERP_PROXY_URL || '',
          logLevel: Number(process.env.NUXT_SHOPINVADER_ERP_PROXY_LOGLEVEL) || 0
        }
      }
    },
    // Client-side and server-side configuration
    public: {
      shopinvader: {
        erp: {
          key: process.env.NUXT_PUBLIC_SHOPINVADER_ERP_KEY || '',
          url: process.env.NUXT_PUBLIC_SHOPINVADER_ERP_URL || '',
          default_role: 'default'
        },
        auth: {
          type: process.env.NUXT_PUBLIC_SHOPINVADER_AUTH_TYPR || 'credentials',
          profile: {
            loginPage: '/account/login',
            logoutPage: '/'
          }
        },
        endpoint: 'shopinvader',
        elasticsearch: {
          url: process.env.NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_URL || '',
          indices: {
            products: process.env.NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_PRODUCTS || '',
            categories: process.env.NUXT_PUBLIC_SHOPINVADER_ELASTICSEARCH_INDICES_CATEGORIES || ''
          }
        }
      }
    }
  },
  modules: [
    '@nuxtjs/critters',
    'nuxt-icon',
    '@nuxtjs/tailwindcss',
    join(dir, 'modules/shopinvader'),
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    'nuxt-simple-robots',
    'nuxt-schema-org',
    "nuxt-delay-hydration"
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict'
    },
    storage: 'localStorage'
  },
  image: {
    format: ["webp"],
  },
  pages: true,
  sitemap: {
    exclude: ['/cart', '/checkout', '/template/**', '/account', '/account/**', '/_shopinvader']
  },
  critters: {
    config: {
      preload: 'swap',
    },
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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
    },
  },
  build: {
    transpile: ['@shopinvader/cart']
  },
  devtools: {
    enabled: false
  },
  routeRules: {
    '/': {
      index: true,
      ssr: true,
      swr: 60*60
    },
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
    }
  },
  site: {
    url: 'https://example.com',
    name: 'My Website'
  },
  fonts: {
    providers: {
      google: {}
    }
  }
})
