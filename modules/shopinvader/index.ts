import {
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
  resolveFiles
} from '@nuxt/kit'

import type { Router } from 'vue-router'
import type {
  ShopinvaderConfig,
  ShopinvaderFetcherInterceptors,
  ShopinvaderFetchersList
} from './runtime/types/ShopinvaderConfig'
import { useShopinvaderLogger } from './runtime/utils/logger'

import type { HookResult, Nuxt } from 'nuxt/schema'
import {
  addI18n,
  addModelsServicesTemplates,
  addOriginalComponents,
  configMerge
} from './runtime/utils'

declare module '#app' {
  // Define additional runtime hooks
  interface RuntimeNuxtHooks {
    'shopinvader:loaded': (nuxt: Nuxt) => HookResult
    'shopinvader:fetchers_interceptors': (
      interceptors: ShopinvaderFetcherInterceptors,
      shopinvaderConfig: ShopinvaderConfig,
      ctx: unknown
    ) => HookResult
    'shopinvader:fetchers': (
      fetchers: ShopinvaderFetchersList,
      shopinvaderConfig: ShopinvaderConfig,
      ctx: unknown
    ) => HookResult
    'shopinvader:services': (
      services: ShopinvaderServiceList,
      fetchers: ShopinvaderFetchersList,
      shopinvaderConfig: ShopinvaderConfig,
      ctx: unknown
    ) => HookResult
    'shopinvader:router': (router: Router, component: Component, ctx: unknown) => HookResult
  }
}

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
    const logger = useShopinvaderLogger()
    const { resolve } = createResolver(import.meta.url)
    // Default runtimeConfig
    const runtimeConfig = nuxt.options.runtimeConfig || {}
    let config = configMerge(runtimeConfig?.shopinvader || {}, options)
    if (runtimeConfig?.public?.shopinvader) {
      config = configMerge(runtimeConfig.public.shopinvader, config)
    }
    runtimeConfig.shopinvader = config
    runtimeConfig.public.shopinvader = runtimeConfig.shopinvader

    /* Server */
    addServerHandler({
      // Use proxy for ERP calls from the client to avoid CORS problems (useful in dev mode)
      route: '/shopinvader/**',
      handler: resolve('./runtime/server/erpProxy.ts')
    })

    /* Manually add the I18n module to prevent config merge problems */
    await addI18n(nuxt)

    /** Components */
    if (config.layerOptions?.originalComponents) {
      await addOriginalComponents(nuxt)
    }

    /** Composable */
    await addImportsDir(resolve('./runtime/composables'))

    /** Models & services */
    await addModelsServicesTemplates(nuxt)

    /** Plugins */
    const plugins = await resolveFiles(resolve('./runtime/plugins'), '*.ts')
    let order = 1
    for (const plugin of plugins) {
      addPlugin({ src: plugin, mode: 'all', order })
      order++
    }

    if (nuxt.options.dev) {
      logger.success(
        'Shopinvader config loaded - API %s - Elastic %s',
        config.erp.url,
        config.elasticsearch.url
      )
    }
    await nuxt.callHook('shopinvader:loaded' as any, nuxt)
  }
})
