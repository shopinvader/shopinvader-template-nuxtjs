import type { AuthAPIConfig, AuthOIDCConfig } from '#services'
import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'
import {
  AddressService,
  AuthService,
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

export interface ShopinvaderProvidersList {
  // One erp provider
  erp: ErpFetch
  // Elastic providers
  products: ElasticFetch
  categories: ElasticFetch
  elasticsearch: ElasticFetch
  elasticAddons: {
    [key: string]: ElasticFetch
  }
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
  leads: LeadsService | null
}
