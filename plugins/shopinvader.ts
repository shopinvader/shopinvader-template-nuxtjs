import { ErpFetch, ElasticFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import {
  CategoryService,
  ProductService,
  CatalogService,
  CartService,
  AddressService,
  SettingService
} from '../services'

export interface ShopinvaderProvidersList {
  [key: string]: ErpFetch | ElasticFetch
}

export interface ShopinvaderServiceList {
  products: ProductService
  categories: CategoryService
  catalog: CatalogService
  cart: CartService | null
  addresses: AddressService | null
  settings: SettingService | null
}

let providers: ShopinvaderProvidersList | null = null
let services: ShopinvaderServiceList | null = null
export const fetchAPI = async (url: string, options: any) => {
  const auth = useAuth()
  if (auth !== null && auth?.getUser !== null) {
    const user = await auth.getUser()
    options.headers = {
      ...options.headers,
      ...{ Authorization: `Bearer ${user?.access_token}` }
    }
  }
  return await fetch(url, options)
}

export const fetchElastic = async (url: string, options: any) => {
  const response = await fetch(url, options)
  if (response.status !== 200) {
    console.log('Error', response.status, response.statusText)
    throw new Error(response.statusText)
  }
  return response
}

export const initProviders = (isoLocale: string | null = null) => {
  const providers: ShopinvaderProvidersList = {}
  const options = useRuntimeConfig()?.shopinvader || null
  const { elasticsearch, erp } = options

  if (options == null) {
    throw new Error('No shopinvader config found')
  }
  let indices = elasticsearch?.indices || []
  if (
    isoLocale !== null &&
    elasticsearch !== null &&
    Array.isArray(elasticsearch?.indices) === true
  ) {
    indices = elasticsearch.indices.map((item: any) => {
      return {
        ...item,
        ...{ index: `${item.index}_${isoLocale}` }
      }
    })
  }

  if (erp && erp?.api_url) {
    providers['erp'] = new ErpFetch(
      erp.api_url,
      erp?.website_key || '',
      fetchAPI
    )
  }

  if (elasticsearch && elasticsearch?.url !== null && Array.isArray(indices)) {
    for (const index of indices) {
      providers[index.name] = new ElasticFetch(
        elasticsearch.url,
        index?.index,
        fetchElastic
      )
    }
    const allIndex = indices.map((index) => index.index).join(',')
    providers['elasticsearch'] = new ElasticFetch(
      elasticsearch.url,
      allIndex,
      fetch
    )
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
      products: new ProductService(providers?.products as ElasticFetch),
      categories: new CategoryService(providers?.categories as ElasticFetch),
      catalog: new CatalogService(providers?.elasticsearch as ElasticFetch),
      cart: null,
      settings: null,
      addresses: null
    }
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

export interface Shopinvader {
  services: ShopinvaderServiceList
  providers: ShopinvaderProvidersList
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
