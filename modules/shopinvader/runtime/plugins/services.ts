import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import { ShopinvaderConfig, ShopinvaderProvidersList, ShopinvaderServiceList as ServiceList } from '../types/ShopinvaderConfig'
import { initProviders } from './providers/index'
import {
  AddressService,
  AuthService,
  CartService,
  CustomerService,
  DeliveryCarrierService,
  PaymentModeService,
  SaleService,
  SettingService,
  ProductService,
  CategoryService,
  CatalogService
} from '~/services'
import { AuthOIDCService, AuthCredentialService } from '#services'

declare global {
  interface ShopinvaderServiceList extends ServiceList {}
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const app = useNuxtApp()
  const { data:configData } = await useAsyncData(
    async () => {
      const runtimeConfig = useRuntimeConfig()
      let config = {
        ...runtimeConfig?.public?.shopinvader,
        ...runtimeConfig?.shopinvader,
      }

      if(config?.erp?.proxy) {
        config.erp = {
          ...runtimeConfig?.public?.shopinvader?.erp,
          proxy: null
        }
      }
      return config
    }
  )
  const config = configData?.value
  if (!config) {
    throw new Error('No shopinvader config found')
  }
  const isoLocale: string = app.$i18n?.localeProperties?.value?.iso || 'fr_fr'
  const providers = initProviders(config as ShopinvaderConfig, isoLocale)

  const erp = providers?.erp as ErpFetch
  const products = new ProductService(providers?.products as ElasticFetch)
  const categories = new CategoryService(providers?.categories as ElasticFetch)
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
    products,
    categories,
    catalog: new CatalogService(providers?.elasticsearch as ElasticFetch),
    cart: new CartService(erp, products),
    settings: new SettingService(erp),
    addresses: new AddressService(erp),
    sales: new SaleService(erp, products),
    deliveryCarriers: new DeliveryCarrierService(erp),
    paymentModes: new PaymentModeService(erp),
    auth,
    customer: new CustomerService(erp)
  }

  await nuxtApp.callHook('shopinvader:services', services, providers, nuxtApp)
  nuxtApp.hook('app:mounted', async (context) => {
    services.cart.productService = services.products
    for (const key in services) {
      if (services[key] && services[key].init) {
        await services[key].init(services)
      }
    }
  })

  if(services?.auth && services?.cart) {
    /** Retrieve cart content on user login */
    auth?.onUserLoaded((user) => {
      services.cart.sync()
    })
    /** Clear cart after user logout */
    auth?.onUserUnLoaded(() => {
      services.cart.clear()
    })
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
