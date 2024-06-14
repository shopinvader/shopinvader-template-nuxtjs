import { useRuntimeConfig } from '#app'
import type {
  ShopinvaderServiceList as ServiceList,
  ShopinvaderConfig,
  ShopinvaderProvidersList
} from '../types/ShopinvaderConfig'
import { initProviders } from './providers/index'

import type { AuthAPIConfig, AuthOIDCConfig, AuthService } from '#services'

import {
  AddressService,
  AuthCredentialService,
  AuthOIDCService,
  CartService,
  CatalogService,
  CategoryService,
  CustomerService,
  DeliveryCarrierService,
  PaymentService,
  ProductService,
  SaleService,
  SettingService
} from '#services'
import type { ErpFetchObservable } from './providers/ErpFetchObservable'

declare global {
  interface ShopinvaderServiceList extends ServiceList {}
}

const isValidURL = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const app = useNuxtApp()
  const shopinvaderConfig = useRuntimeConfig()?.public?.shopinvader as ShopinvaderConfig
  let config = {
    ...shopinvaderConfig
  }
  const url = config?.erp?.url || ''
  if (!url || !isValidURL(url)) {
    const url = useRequestURL()
    config = {
      ...config,
      erp: {
        ...config?.erp,
        url: `${url.origin}/shopinvader/`
      }
    }
  }

  const i18nOptions: any = app.$i18n || {}
  const isoLocale: string = i18nOptions?.localeProperties?.value?.iso || 'fr_fr'
  //  ERP and Elastic providers (fetches)
  const providers = initProviders(config as ShopinvaderConfig, isoLocale)
  const erp = providers.erp
  const elasticProducts = providers.products
  const elasticCategories = providers.categories
  const elasticSearch = providers.elasticsearch

  let auth: AuthService | null = null
  if (config?.auth?.type) {
    /** Auth Service */
    const profile = config.auth?.profile
    if (config.auth.type === 'oidc') {
      auth = new AuthOIDCService(erp as ErpFetchObservable, profile as AuthOIDCConfig)
    } else {
      auth = new AuthCredentialService(erp, profile as AuthAPIConfig)
    }
  }

  const services: ShopinvaderServiceList = {
    auth,
    products: new ProductService(elasticProducts),
    categories: new CategoryService(elasticCategories),
    catalog: new CatalogService(elasticSearch),
    cart: new CartService(erp),
    settings: new SettingService(erp),
    addresses: new AddressService(erp),
    sales: new SaleService(erp),
    deliveryCarriers: new DeliveryCarrierService(erp),
    payment: new PaymentService(erp),
    customer: new CustomerService(erp)
  }

  // The following hook is used to let children add custom services to the app
  await nuxtApp.callHook('shopinvader:services', services, providers, nuxtApp)
  // Init all services when the app is mounted
  nuxtApp.hook('app:mounted', async () => {
    if (services) {
      for (const service of Object.values(services)) {
        await service?.init?.(services)
      }
    }
  })

  return {
    provide: {
      shopinvader: {
        services,
        providers
      }
    }
  }
})

declare global {
  interface Shopinvader {
    services: ShopinvaderServiceList
    providers: ShopinvaderProvidersList
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
