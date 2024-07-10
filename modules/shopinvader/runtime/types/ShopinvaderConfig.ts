import type {
  AuthAPIConfig,
  AuthOIDCConfig,
  PaymentService,
  AddressService,
  AuthService,
  CartService,
  CatalogService,
  CategoryService,
  CustomerService,
  DeliveryCarrierService,
  ProductService,
  SaleService,
  SettingService
} from '#services'
import type { $Fetch } from 'ofetch'

export interface ShopinvaderProxyConfig {
  url: string
  auth?: string
  logLevel?: number // 0=off, 1=info, 2=debug
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

export interface ShopinvaderFetchersList {
  erpFetch: $Fetch
  elasticFetch: $Fetch
}

export interface ShopinvaderServiceList {
  auth: AuthService | null
  products: ProductService
  categories: CategoryService
  catalog: CatalogService
  cart: CartService
  addresses: AddressService | null
  settings: SettingService | null
  sales: SaleService | null
  customer: CustomerService | null
  deliveryCarriers: DeliveryCarrierService | null
  payment: PaymentService | null
}
