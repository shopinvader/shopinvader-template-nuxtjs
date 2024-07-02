import type { Product } from '#models'

export interface ProductResult {
  hits: Product[]
  total: number
  aggregations?: any
  suggestions?: any
}
