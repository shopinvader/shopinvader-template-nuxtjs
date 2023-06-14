import { ElasticFetch, ErpFetch } from '@shopinvader/fetch'

export interface ShopinvaderErpConfig {
  website_key: string
  api_url: string
  default_role: string
}
export interface ShopinvaderElasticConfig {
  url: string
  indices: Array<{ name: string; index: string; body: any }>
}

export interface ShopinvaderProvidersList {
  [key: string]: ErpFetch | ElasticFetch
}

export interface ShopinvaderConfig {
  erp: ShopinvaderErpConfig
  elasticsearch: ShopinvaderElasticConfig
  endpoint: string
}
