export interface ShopinvaderErpOptions {
  website_key?: string
  api_url: string
  default_role: string
}

export interface ShopinvaderElasticIndexOptions {
  index: string
  name: string
  body: any
}

export interface ShopinvaderElasticOptions {
  url: string
  indices: ShopinvaderElasticIndexOptions[]
}

export interface ShopinvaderOptions {
  endpoint: string
  erp: ShopinvaderErpOptions
  elasticsearch: ShopinvaderElasticOptions
}