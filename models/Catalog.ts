import { Category, Product } from '#models'

export interface CatalogResult {
  hits: (Category | Product)[]
  total: number
  aggregations?: any
  rawsHits?: any[]
}
