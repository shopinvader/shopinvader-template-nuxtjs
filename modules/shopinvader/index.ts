import { addCustomTab } from '@nuxt/devtools-kit'
import { defineNuxtModule,
  createResolver,
  useLogger,
  addPlugin,
  addRouteMiddleware,
  addImportsDir,
  resolveFiles,
  extendPages,
  addServerHandler,
} from '@nuxt/kit'

import {
  type ShopinvaderConfig,
  type ShopinvaderProvidersList
} from './runtime/types/ShopinvaderConfig'
import { type Router } from 'vue-router'

import {
  configMerge,
  addModelsServicesTemplates,
  addI18n,
  addOriginalComponents
} from './runtime/utils'

type MaybePromise<T> = T | Promise<T>

declare module '#app' {
  interface RuntimeNuxtHooks {
    'shopinvader:loaded': <Context = unknown>(
      ctx: Context
    ) => MaybePromise<void>
    'shopinvader:services': <Context = unknown>(
      services: ShopinvaderServiceList,
      providers: ShopinvaderProvidersList,
      ctx: Context
    ) => MaybePromise<void>
    'shopinvader:router': <Context = unknown>(
      router: Router,
      component: Component,
      ctx: Context
    ) => MaybePromise<void>
  }
}
export { ErpFetchObservable } from './runtime/plugins/providers/ErpFetchObservale'
export default defineNuxtModule<ShopinvaderConfig>({
  meta: {
    name: 'shopinvader',
    configKey: 'shopinvader'
  },
  defaults: {
    erp: {
      key: 'default',
      url: 'http://localhost:8000',
      default_role: 'default'
    },
    endpoint: 'shopinvader',
    elasticsearch: {
      url: 'http://localhost:9200',
      indices: {
        products: 'products',
        categories: 'categories'
      }
    },
    layerOptions: {
      originalComponents: true
    }
  },
  async setup(options, nuxt) {
    const console = useLogger('shopinvader')
    const { resolve } = createResolver(import.meta.url)
    // Default runtimeConfig
    const runtimeConfig = nuxt.options.runtimeConfig || {}
    let config = configMerge(runtimeConfig?.shopinvader || {}, options)
    if(runtimeConfig?.public?.shopinvader) {
      config = configMerge(runtimeConfig.public.shopinvader, config)
    }
    runtimeConfig.shopinvader = config
    runtimeConfig.public.shopinvader = runtimeConfig.shopinvader

    /* Server */
    addServerHandler({
      route: '/shopinvader/**',
      handler: resolve('./runtime/server/erpProxy.ts')
    })

    /* I18n */
    await addI18n(nuxt)

    /** Components */
    if(config.layerOptions?.originalComponents) {
      await addOriginalComponents(nuxt)
    }

    /** Composable */
    await addImportsDir(resolve('./runtime/composables'))

    /** Models & services */
    await addModelsServicesTemplates(nuxt)

    /** Plugins */
    const plugins = await resolveFiles(resolve('./runtime/plugins'), '*.ts')
    let order = 1
    for(let plugin of plugins) {
      addPlugin({src: plugin, mode: 'all', order})
      order++
    }

    if(nuxt.options.dev && nuxt.options?.devtools?.enabled) {
      extendPages((pages) => {
        pages.push({
          name: 'shopinvader',
          path: '/_shopinvader',
          file: resolve('./runtime/devtool/index.vue')
        })
      })

      addCustomTab({
        // unique identifier
        name: 'shopinvader',
        // title to display in the tab
        title: 'Shopinvader',
        // any icon from Iconify, or a URL to an image
        icon: 'mdi:space-invaders',
        // iframe view
        view: {
          type: 'iframe',
          src: '/_shopinvader',
        },
      })
    }

    if(nuxt.options.dev) {
      console.success("Shopinvader config loaded - API %s - Elastic %s", config.erp.url, config.elasticsearch.url)
    }
    nuxt.callHook('shopinvader:loaded', nuxt)
  }
})


