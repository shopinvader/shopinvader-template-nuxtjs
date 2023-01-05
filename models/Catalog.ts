import { Category } from './Category'
import { Product } from './Product'

export interface CatalogResult {
  hits: (Category | Product)[]
  total: number
  aggregations?: any
}
