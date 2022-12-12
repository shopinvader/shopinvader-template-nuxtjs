import { ErpFetch, ElasticFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import { CategoryService, ProductService, CatalogService, CartService } from '../services'
let providers = null
let services = null

export const fetchAPI = (url: string, options: any) => {
  return fetch(url, options)
}

export const initProviders = (isoLocale) => {
  let providers = {}
  const options = useRuntimeConfig()?.shopinvader || null
  let { elasticsearch, erp } = options

  if (options == null) {
    throw new Error('No shopinvader config found')
  }
  let indices = elasticsearch?.indices || []
  if (isoLocale !== null && elasticsearch !== null && Array.isArray(elasticsearch?.indices) === true) {

    indices = elasticsearch.indices.map((item) => {
      return {
        ...item,
        ...{ index: `${item.index}_${isoLocale}` }
      }
    })
  }

  if (erp && erp?.api_url) {
    providers['erp'] = new ErpFetch(erp.api_url, erp?.website_key || '', fetchAPI)
  }

  if (elasticsearch && elasticsearch?.url !== null && Array.isArray(indices)) {
    for (const index of indices) {
      providers[index.name] = new ElasticFetch(elasticsearch.url, index?.index, fetchAPI)
    }
    const allIndex = indices.map((index) => index.index).join(',')
    providers['elasticsearch'] = new ElasticFetch(elasticsearch.url, allIndex, fetchAPI)
  }
  return providers
}

export default defineNuxtPlugin((nuxtApp) => {
  if (providers === null) {
    const isoLocale = nuxtApp.$i18n?.localeProperties?.value?.iso || null
    providers = initProviders(isoLocale)
  }
  if (services === null) {
    services = {
      products: new ProductService(providers?.products),
      categories: new CategoryService(providers?.categories),
      catalog: new CatalogService(providers?.elasticsearch),
    }

  }
  if (process?.client) {
    services.cart = new CartService(providers?.erp, services?.products)
  }

  return {
    provide: {
      shopinvader: {
        services,
        providers
      }
    }
  }
})

export interface ShopinvaderServiceList {
  products: ProductService
  categories: CategoryService
  catalog: CatalogService
  cart: CartService
}

export interface Shopinvader {
  services: ShopinvaderServiceList
  providers: {
    [key: string]: any
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
