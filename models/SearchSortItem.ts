import type { Script } from 'elastic-builder'

export interface SearchSortItem {
  label: string
  value: string
  order?: 'desc' | 'asc'
  script?: Script
}
