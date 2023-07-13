import { AuthAPIConfig } from '~/services/auth/AuthAPI'
import { AuthOIDCConfig } from '~/services/auth/AuthOIDC'

export interface ShopinvaderProxyConfig {
  url: string
  auth?: string
}

export interface ShopinvaderErpConfig {
  key: string
  url: string
  default_role: string
  proxy?: ShopinvaderProxyConfig
}

export interface ShopinvaderElasticConfig {
  url: string
  indices: {
    products: string
    categories: string
    [key: string]: string
  }
}

export interface ShopinvaderAuthConfig {
  type: 'oidc' | 'api'
  profile: AuthOIDCConfig | AuthAPIConfig
}

export interface ShopinvaderConfig {
  auth?: ShopinvaderAuthConfig
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
