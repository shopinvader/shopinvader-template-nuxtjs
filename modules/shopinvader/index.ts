import { defu, createDefu } from 'defu'
import { defineNuxtModule, createResolver, useLogger, addPlugin, addImportsDir, resolveFiles, extendPages, installModule} from '@nuxt/kit'
import { ShopinvaderConfig } from './runtime/types/ShopinvaderConfig'
import { addCustomTab } from '@nuxt/devtools-kit'
import {
  addModelsTemplates,
  addServicesTemplates,
  addI18n,
  addOriginalComponents
} from './runtime/utils'
const configMerge = createDefu((obj, key, value) => {
  if (key === 'indices') {
    obj[key] = value
    return true
  }
})
export default defineNuxtModule<ShopinvaderConfig>({
  meta: {
    name: 'shopinvader',
    configKey: 'shopinvader'
  },
  defaults: {
    erp: {
      website_key: 'default',
      api_url: 'http://localhost:8000',
      default_role: 'default'
    },
    endpoint: 'shopinvader',
    elasticsearch: {
      url: 'http://localhost:9200',
      indices: [
        {
          name: 'categories',
          index: 'categories',
          body: {}
        },
        {
          name: 'products',
          index: 'products',
          body: {}
        }
      ]
    },
    layerOptions: {
      originalComponents: true
    }
  },
  async setup(options, nuxt) {
    const console = useLogger('shopinvader')
    const { resolve } = createResolver(import.meta.url)
    // Default runtimeConfig
    const config = configMerge(nuxt.options.runtimeConfig.shopinvader, options)
    nuxt.options.runtimeConfig.shopinvader = config
    nuxt.options.runtimeConfig.public.shopinvader = nuxt.options.runtimeConfig.shopinvader
    console.success("Shopinvader config loaded - API %s - Elastic %s", config.erp.api_url, config.elasticsearch.url)
    /* I18n */
    await addI18n(nuxt)

    /** Components */
    if(config.layerOptions?.originalComponents) {
      await addOriginalComponents(nuxt)
    }

    /** Composable */
    await addImportsDir(resolve('./runtime/composables'))

    /** Plugins */
    const plugins = await resolveFiles(resolve('./runtime/plugins'), '*.ts')
    let order = 1
    for(let plugin of plugins) {
      addPlugin({src: plugin, mode: 'all', order})
      order++
    }
    await addModelsTemplates(nuxt)
    await addServicesTemplates(nuxt)

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
  }
})
