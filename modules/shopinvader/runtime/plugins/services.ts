import { ElasticFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import { ShopinvaderConfig, ShopinvaderProvidersList, ShopinvaderServiceList as ServiceList } from '../types/ShopinvaderConfig'
import { initProviders } from './providers/index'

import {
  AuthOIDCService,
  AuthCredentialService,
  AddressService,
  AuthService,
  CartService,
  CustomerService,
  DeliveryCarrierService,
  SaleService,
  SettingService,
  ProductService,
  CategoryService,
  CatalogService,
  PaymentService,
  LeadsService
} from '#services'

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
  if(!url || !isValidURL(url) ) {
    const url = useRequestURL()
    config = {
      ...config,
      erp: {
        ...config?.erp,
        url:  `${url.origin}/shopinvader/`
      }
    }
  }

  const isoLocale: string = app.$i18n?.localeProperties?.value?.iso || 'fr_fr'
  const providers = initProviders(config as ShopinvaderConfig, isoLocale)

  const {
    erp,
    products,
    categories,
    elasticsearch
  } = providers

  let auth: AuthService | null = null
  if (config?.auth?.type) {
    /** Auth Service */
    const profile = config.auth?.profile
    if (config.auth.type === 'oidc') {
      auth = new AuthOIDCService(erp, profile)
    } else {
      auth = new AuthCredentialService(erp, profile)
    }
  }

  const services = {
    auth,
    config,
    products: new ProductService(products as ElasticFetch),
    categories: new CategoryService(categories as ElasticFetch),
    catalog: new CatalogService(elasticsearch as ElasticFetch),
    cart: new CartService(erp),
    settings: new SettingService(erp),
    addresses: new AddressService(erp),
    sales: new SaleService(erp),
    deliveryCarriers: new DeliveryCarrierService(erp),
    payment: new PaymentService(erp),
    customer: new CustomerService(erp),
    leads: new LeadsService(erp)
  }

  await nuxtApp.callHook('shopinvader:services', services, providers, nuxtApp)
  nuxtApp.hook('app:mounted', async (context) => {
    if(services) {
      for(let service of Object.values(services)) {
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
