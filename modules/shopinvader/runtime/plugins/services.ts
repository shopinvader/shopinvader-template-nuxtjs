import { useRuntimeConfig } from '#app'
import { Settings } from '#models'
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
  LeadsService,
  PaymentService,
  ProductService,
  SaleService,
  SettingService
} from '#services'
import { ofetch } from 'ofetch'
import type {
  ShopinvaderServiceList as ServiceList,
  ShopinvaderConfig,
  ShopinvaderFetcherInterceptors,
  ShopinvaderFetchersList
} from '../types/ShopinvaderConfig'

declare global {
  interface Shopinvader {
    services: ShopinvaderServiceList
    fetchers: ShopinvaderFetchersList
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
 * It also provides the fetchers to fetch data from the ERP and ElasticSearch.
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
  // Replace the config with a copy to avoid modifying the original
  shopinvaderConfig = JSON.parse(JSON.stringify(shopinvaderConfig))
  // If the ERP url is not valid, we fix the config with the current URL
  const url = shopinvaderConfig.erp.url || ''
  if (!url || !isValidURL(url)) {
    shopinvaderConfig.erp.url = useRequestURL().origin + '/shopinvader/'
  }

  // Build services
  // --------------
  
  // Services need fetchers, build default ones

  // Allow the app to add interceptors to the fetchers
  const oFetchInterceptors: ShopinvaderFetcherInterceptors = {
    elasticFetch: {
      onRequest: [],
      onRequestError: [],
      onResponse: [],
      onResponseError: []
    },
    erpFetch: {
      onRequest: [],
      onRequestError: [],
      onResponse: [],
      onResponseError: []
    }
  }

  // Let the app add its own interceptors
  await nuxtApp.callHook(
    'shopinvader:fetchers_interceptors',
    oFetchInterceptors,
    shopinvaderConfig,
    nuxtApp
  )
  // Create the fetchers with the interceptors
  const fetchers: ShopinvaderFetchersList = {
    elasticFetch: ofetch.create({
      async onRequest({ request, options }) {
        for (const interceptor of oFetchInterceptors.elasticFetch.onRequest) {
          await interceptor({ request, options })
        }
      },
      async onRequestError({ request, options, error }) {
        for (const interceptor of oFetchInterceptors.elasticFetch.onRequestError) {
          await interceptor({ request, options, error })
        }
      },
      async onResponse({ request, options, response }) {
        for (const interceptor of oFetchInterceptors.elasticFetch.onResponse) {
          await interceptor({ request, options, response })
        }
      },
      async onResponseError({ request, response, options }) {
        for (const interceptor of oFetchInterceptors.elasticFetch.onResponseError) {
          await interceptor({ request, response, options })
        }
      }
    }),
    erpFetch: ofetch.create({
      async onRequest({ request, options }) {
        for (const interceptor of oFetchInterceptors.erpFetch.onRequest) {
          await interceptor({ request, options })
        }
      },
      async onRequestError({ request, options, error }) {
        for (const interceptor of oFetchInterceptors.erpFetch.onRequestError) {
          await interceptor({ request, options, error })
        }
      },
      async onResponse({ request, options, response }) {
        for (const interceptor of oFetchInterceptors.erpFetch.onResponse) {
          await interceptor({ request, options, response })
        }
      },
      async onResponseError({ request, response, options }) {
        for (const interceptor of oFetchInterceptors.erpFetch.onResponseError) {
          await interceptor({ request, response, options })
        }
      }
    })
  }

  // Let the child replace fetchers with theirs if needed
  await nuxtApp.callHook('shopinvader:fetchers', fetchers, shopinvaderConfig, nuxtApp)

  // Shortcuts to data
  const i18nOptions: any = nuxtApp.$i18n || {}
  const isoLocale: string =
    i18nOptions?.localeProperties?.value?.language ||
    i18nOptions?.localeProperties?.value?.iso || // For nuxt-i18n < 7
    'fr_fr'
  const erpBaseUrl = shopinvaderConfig.erp.url
  const erpFetch = fetchers.erpFetch
  const elasticBaseUrl = shopinvaderConfig.elasticsearch.url
  const elasticFetch = fetchers.elasticFetch
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

  // Fill the settings if provided in the app.config.ts (will be overriden by the fetch in the init call later)
  const { settings } = useAppConfig()
  if (settings && services.settings) {
    services.settings.setValues(new Settings(settings))
  }

  // Let the child App add custom services or replace the default ones
  await nuxtApp.callHook('shopinvader:services', services, fetchers, shopinvaderConfig, nuxtApp)

  // Add Auth interceptors to the fetchers
  oFetchInterceptors.erpFetch.onRequest.push(async ({ request, options }) => {
    services.auth?.interceptorOnRequest({ request, options })
  })
  oFetchInterceptors.erpFetch.onResponseError.push(({ request, response, options }) => {
    services.auth?.interceptorOnResponseError({ request, response, options })
  })

  // Init all services when the app is mounted
  // -----------------------------------------
  if (services) {
    for (const service of Object.values(services)) {
      await service.init(services)
    }
  }

  // Manage the language switch
  // --------------------------
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nuxtApp.hook('i18n:localeSwitched', ({ oldLocale, newLocale }) => {
    if (services) {
      for (const service of Object.values(services)) {
        service.changeLocale(newLocale)
      }
    }
  })

  // Provide the services and fetchers to the app
  return {
    provide: {
      shopinvader: {
        fetchers,
        services
      }
    }
  }
})

const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
