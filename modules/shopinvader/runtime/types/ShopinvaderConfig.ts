export interface ShopinvaderErpConfig {
  website_key: string
  api_url: string
  default_role: string
}
export interface ShopinvaderElasticConfig {
  url: string
  indices: Array<{ name: string; index: string; body: any }>
}

export interface ShopinvaderConfig {
  erp: ShopinvaderErpConfig
  elasticsearch: ShopinvaderElasticConfig
  endpoint: string
  layerOptions?: {
    originalComponents?: boolean
  }
}
import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'
import {
  AddressService,
  AuthService,
  CartService,
  CatalogService,
  CategoryService,
  CustomerService,
  DeliveryCarrierService,
  PaymentModeService,
  ProductService,
  SaleService,
  SettingService
} from '~/services'

export interface ShopinvaderProvidersList {
  [key: string]: ErpFetch | ElasticFetch
}

export interface ShopinvaderServiceList {
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
