import type { Category } from '#models'

export interface CategoryResult {
  hits: Category[]
  total: number
  aggregations?: any
}
