import type {
  AddressService,
  AuthAPIConfig,
  AuthOIDCConfig,
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
import type { $Fetch, FetchOptions, FetchResponse, ResponseType } from 'ofetch'

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
  leads: LeadsService | null
}

export type oFetchRequestCtx = {
  request: RequestInfo
  options: FetchOptions
}
export type oFetchRequestErrorCtx = {
  request: RequestInfo
  options: FetchOptions
  error: Error
}
export type oFetchResponseCtx = {
  request: RequestInfo
  options: FetchOptions
  response: FetchResponse<ResponseType>
}
export type oFetchResponseErrorCtx = {
  request: RequestInfo
  options: FetchOptions
  response: FetchResponse<ResponseType>
}
export interface oFetchInterceptors {
  onRequest: ((ctx: oFetchRequestCtx) => Promise<void>)[]
  onRequestError: ((ctx: oFetchRequestErrorCtx) => Promise<void>)[]
  onResponse: ((ctx: oFetchResponseCtx) => Promise<void>)[]
  onResponseError: ((ctx: oFetchResponseErrorCtx) => Promise<void>)[]
}

export interface ShopinvaderFetcherInterceptors {
  erpFetch: oFetchInterceptors
  elasticFetch: oFetchInterceptors
}
