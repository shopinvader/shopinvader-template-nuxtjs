import { Shopinvader } from '@shopinvader/services'
import { useI18n, useLocalePath } from '#imports'
import { CategoryService, ProductService } from '../services'
import { CatalogService } from '~/services/CatalogService'

export default defineNuxtPlugin((nuxtApp) => {
  const isoLocale = nuxtApp?.$i18n?.localeProperties?.value?.iso

  let options = {
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
  if (isoLocale) {
    options.elasticsearch.indices = options.elasticsearch.indices.map((item) => {
      item.index = item.index + '_en_us' //+ isoLocale
      return item
    })
  }

  console.log('options', options)
  const fetchwithAuth = (url: string, options: any) => {
    return fetch(url, options)
  }
  const shopinvader = new Shopinvader(options, fetchwithAuth)
  shopinvader.registerService('products', ProductService)
  shopinvader.registerService('categories', CategoryService)
  shopinvader.registerService('catalog', CatalogService)
  return {
    provide: {
      shopinvader
    }
  }
})

declare module '@shopinvader/services' {
  interface ShopinvaderServiceList {
    products: ProductService
    categories: CategoryService
    catalog: CatalogService
  }
}

declare module '#app' {
  interface NuxtApp {
    $shopinvader: Shopinvader
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $shopinvader: Shopinvader
  }
}

