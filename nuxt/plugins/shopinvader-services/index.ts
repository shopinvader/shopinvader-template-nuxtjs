import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import { ShopinvaderConfig, ShopinvaderProvidersList } from './type'
import { ProductService, CategoryService, CatalogService } from '../../services'
import { initProviders } from './providers/index'
import {
  AddressService,
  AuthService,
  CartService,
  CustomerService,
  DeliveryCarrierService,
  PaymentModeService,
  SaleService,
  SettingService
} from '~/services'

declare global {
  interface ShopinvaderServiceList {
    auth: AuthService
    products: ProductService
    categories: CategoryService
    catalog: CatalogService
    cart: CartService
    addresses: AddressService | null
    settings: SettingService | null
    sales: SaleService | null
    customer: CustomerService | null
    deliveryCarriers: DeliveryCarrierService | null
    paymentModes: PaymentModeService | null
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const config =
    runtimeConfig?.public?.shopinvader || runtimeConfig?.shopinvader || null
  if (!config) {
    throw new Error('No shopinvader config found')
  }
  const providers = initProviders(config as ShopinvaderConfig)
  const erp = providers?.erp as ErpFetch
  const products = new ProductService(providers?.products as ElasticFetch)
  const categories = new CategoryService(providers?.categories as ElasticFetch)
  const services = {
    products,
    categories,
    catalog: new CatalogService(providers?.elasticsearch as ElasticFetch),
    cart: new CartService(erp, products),
    settings: new SettingService(erp),
    addresses: new AddressService(erp),
    sales: new SaleService(erp),
    deliveryCarriers: new DeliveryCarrierService(erp),
    paymentModes: new PaymentModeService(erp),
    auth: new AuthService(erp),
    customer: new CustomerService(erp)
  }
  if (process.client) {
    /** Auto Loggin - Init the user */
    services?.auth.me()
    services?.auth.onUserLoaded(() => {
      services.settings.init()
    })
  }
  /**
   * Add a middleware to check if the user is logged in
   */
  addRouteMiddleware(async (to) => {
    if (to?.meta?.auth) {
      const user = services.auth.getUser()?.value || null
      if (!user) {
        return '/'
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
