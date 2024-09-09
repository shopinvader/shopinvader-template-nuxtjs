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
import { ofetch } from 'ofetch'
import type {
  ShopinvaderServiceList as ServiceList,
  ShopinvaderConfig,
  ShopinvaderProvidersList
} from '../types/ShopinvaderConfig'

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
  // Get the shopinvader config from the runtime config
  let shopinvaderConfig = useRuntimeConfig()?.public?.shopinvader as ShopinvaderConfig

  // Checks on minimal config
  // ------------------------
  if (shopinvaderConfig == null) {
    throw new Error('No shopinvader config found')
  }
  if (!shopinvaderConfig.erp || !shopinvaderConfig.erp.url) {
    throw new Error('No shopinvader erp config found')
  }
  if (!shopinvaderConfig.elasticsearch || !shopinvaderConfig.elasticsearch.url) {
    throw new Error('No shopinvader elasticsearch config found')
  }
  // Replace the config with a copy of the config to avoid modifying the original
  shopinvaderConfig = JSON.parse(JSON.stringify(shopinvaderConfig))
  // If the ERP url is not valid, we fix the config with the current URL
  const url = shopinvaderConfig.erp.url || ''
  if (!url || !isValidURL(url)) {
    shopinvaderConfig.erp.url = useRequestURL().origin + '/shopinvader/'
  }

  // Build services
  // --------------
  // Services need fetch providers, build default ones
  const providers: ShopinvaderProvidersList = {
    erpFetch: ofetch.create({}),
    elasticFetch: ofetch.create({})
  }
  // Let the child replace the fetch providers with theirs if needed
  await nuxtApp.callHook('shopinvader:providers', providers, shopinvaderConfig, nuxtApp)

  // Shortcuts to data
  const i18nOptions: any = nuxtApp.$i18n || {}
  const isoLocale: string = i18nOptions?.localeProperties?.value?.iso || 'fr_fr'
  const erpBaseUrl = shopinvaderConfig.erp.url
  const erpFetch = providers.erpFetch
  const elasticBaseUrl = shopinvaderConfig.elasticsearch.url
  const elasticFetch = providers.elasticFetch
  const elasticIndexes = shopinvaderConfig.elasticsearch.indices
  const elasticAllIndexesNames: string[] = Object.values(elasticIndexes)

  // Create the auth service, depending on the config
  let auth: AuthService | null = null
  if (shopinvaderConfig?.auth?.type) {
    const authConfig = shopinvaderConfig.auth?.profile
    if (shopinvaderConfig.auth.type === 'oidc') {
      auth = new AuthOIDCService(isoLocale, erpFetch, erpBaseUrl, authConfig as AuthOIDCConfig)
    } else {
      auth = new AuthCredentialService(isoLocale, erpFetch, erpBaseUrl, authConfig as AuthAPIConfig)
    }
  }

  // Create all other services
  const services: ShopinvaderServiceList = {
    auth,
    products: new ProductService(isoLocale, elasticFetch, elasticBaseUrl, elasticIndexes.products),
    categories: new CategoryService(
      isoLocale,
      elasticFetch,
      elasticBaseUrl,
      elasticIndexes.categories
    ),
    catalog: new CatalogService(isoLocale, elasticFetch, elasticBaseUrl, elasticAllIndexesNames),
    cart: new CartService(isoLocale, erpFetch, erpBaseUrl),
    settings: new SettingService(isoLocale, erpFetch, erpBaseUrl),
    addresses: new AddressService(isoLocale, erpFetch, erpBaseUrl),
    sales: new SaleService(isoLocale, erpFetch, erpBaseUrl),
    deliveryCarriers: new DeliveryCarrierService(isoLocale, erpFetch, erpBaseUrl),
    payment: new PaymentService(isoLocale, erpFetch, erpBaseUrl),
    customer: new CustomerService(isoLocale, erpFetch, erpBaseUrl),
    leads: new LeadsService(isoLocale, erpFetch, erpBaseUrl)
  }

  // Let the child add custom services or replace the default ones
  await nuxtApp.callHook('shopinvader:services', services, providers, shopinvaderConfig, nuxtApp)

  // Init all services when the app is mounted
  // -----------------------------------------
  nuxtApp.hook('app:mounted', async () => {
    if (services) {
      for (const service of Object.values(services)) {
        await service.init(services)
      }
    }
  })

  // Manage the language switch
  // --------------------------
  nuxtApp.hook('i18n:localeSwitched', ({ oldLocale, newLocale }) => {
    console.log('onLanguageSwitched', oldLocale, newLocale)
    if (services) {
      for (const service of Object.values(services)) {
        service.changeLocale(newLocale)
      }
    }
  })

  // Provide the services and providers to the app
  return {
    provide: {
      shopinvader: {
        services,
        providers
      }
    }
  }
})

const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
