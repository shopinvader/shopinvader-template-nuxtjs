import { useRuntimeConfig } from '#app'
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
  SettingService,
  LeadsService
} from '#services'
import type {
  ShopinvaderServiceList as ServiceList,
  ShopinvaderConfig,
  ShopinvaderProvidersList
} from '../types/ShopinvaderConfig'
import type { ErpFetchObservable } from './providers/ErpFetchObservable'
import { initProviders } from './providers/index'

declare global {
  interface Shopinvader {
    services: ShopinvaderServiceList
    providers: ShopinvaderProvidersList
  }
}

declare global {
  interface ShopinvaderServiceList extends ServiceList {}
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

/*
 * This plugin is used to initialize all the services used in the app.
 * It also provides the providers to fetch data from the ERP and ElasticSearch.
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const app = useNuxtApp()
  // Get the shopinvader config from the runtime config
  const shopinvaderConfig = useRuntimeConfig()?.public?.shopinvader as ShopinvaderConfig
  let config = {
    ...shopinvaderConfig
  }
  // If the ERP URL is not valid, we use the current URL
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

  // Get locale from i18n
  const i18nOptions: any = app.$i18n || {}
  const isoLocale: string = i18nOptions?.localeProperties?.value?.iso || 'fr_fr'
  // Init ERP and Elastic providers (fetches)
  const providers = initProviders(config as ShopinvaderConfig, isoLocale)
  const erpProvider = providers.erp
  const productsProvider = providers.products
  const categoriesProvider = providers.categories
  const elasticSearch = providers.elasticsearch

  // Create the auth service, depending on the config
  let auth: AuthService | null = null
  if (config?.auth?.type) {
    const authConfig = config.auth?.profile
    if (config.auth.type === 'oidc') {
      auth = new AuthOIDCService(erpProvider as ErpFetchObservable, authConfig as AuthOIDCConfig)
    } else {
      auth = new AuthCredentialService(erpProvider, authConfig as AuthAPIConfig)
    }
  }
  // Create all other services
  const services: ShopinvaderServiceList = {
    auth,
    products: new ProductService(productsProvider),
    categories: new CategoryService(categoriesProvider),
    catalog: new CatalogService(elasticSearch),
    cart: new CartService(erpProvider),
    settings: new SettingService(erpProvider),
    addresses: new AddressService(erpProvider),
    sales: new SaleService(erpProvider),
    deliveryCarriers: new DeliveryCarrierService(erpProvider),
    payment: new PaymentService(erpProvider),
    customer: new CustomerService(erpProvider),
    leads: new LeadsService(erpProvider)
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

const isValidURL = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
