import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'
import { useRuntimeConfig } from '#app'
import { Product, Category } from '~/models'
import { ShopinvaderConfig, ShopinvaderProvidersList, ShopinvaderServiceList as ServiceList } from '../types/ShopinvaderConfig'
import { initProviders } from './providers/index'
import {TemplateProductPage, TemplateCategoryPage} from '#components'

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

declare global {
  interface ShopinvaderServiceList extends ServiceList {}
}

export default defineNuxtPlugin(async (nuxtApp) => {

  const runtimeConfig = useRuntimeConfig()
  const config = runtimeConfig?.public?.shopinvader || runtimeConfig?.shopinvader || null
  if (!config) {
    throw new Error('No shopinvader config found /!\ **')
  }
  const app = useNuxtApp()
  const isoLocale: string = app.$i18n?.localeProperties?.value?.iso || 'fr_fr'

  const providers = initProviders(config as ShopinvaderConfig, isoLocale)
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
  await nuxtApp.callHook('shopinvader:services', services, providers, nuxtApp)
  services.cart.productService = services.products
  if (!import.meta.env.SSR) {
    /** Auto Loggin - Init the user */
    services?.auth.me()
    services?.auth.onUserLoaded(() => {
      services.settings.init()
    })
  }

  /**
   * Add route middleware to add dynamic routes for products and categories
   * Add a middleware to check if the user is logged in
   */
  const router = useRouter()
  const routes:any = {}
  addRouteMiddleware(
    async (to, from) => {
      if (!router.hasRoute(to.path)) {
        const path: string = to.params?.slug?.join('/') || to.path.substr(1)

        const { data } = await useAsyncData('entity', async () => {
          if(routes?.[path]) {
            return routes[path]
          }
          const catalog = useShopinvaderService('catalog')
          const sku = to?.query?.sku || null as string | null
          const entity = await catalog.getEntityByURLKey(path, sku)
          routes[path] = entity
          return entity
        })
        const entity = data.value
        if (entity) {
          let component = null
          if (entity instanceof Product) {
            component = TemplateProductPage
          } else if (entity instanceof Category) {
            component = TemplateCategoryPage
          }
          if (component) {
            to.matched[0].components = {
              default: component
            }
          }

          await nuxtApp.callHook('shopinvader:router', router, component, nuxtApp)
        }
      }

    },
    { global: true }
  )

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
