import { ElasticFetch } from '@shopinvader/fetch'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { CatalogResult } from '../models/Catalog'

export class CatalogService {
  provider: ElasticFetch | null = null
  constructor(provider: ElasticFetch) {
    this.provider = provider
  }

  async search(body: any): Promise<CatalogResult> {
    if (this.provider == null) {
      throw new Error('No provider found for categories')
    }
    body.collapse = {
      field: 'url_key',
      inner_hits: [
        {
          size: 100,
          name: 'variants'
        }
      ]
    }
    const result = await this.provider?.search(body)
    const rawsHits = result?.hits?.hits?.map((hit: any) => {
      const variants = hit?.inner_hits?.variants?.hits?.hits?.map(
        (variant: any) => variant._source
      )
      return {
        ...hit._source,
        ...{ variants, _index: hit._index }
      }
    })

    const hits = rawsHits.map((hit: any) => {
      return this.jsonToModel(hit)
    })

    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations, rawsHits }
  }
  getByURLKey(urlKey: string): Promise<CatalogResult> {
    return this.find('url_key', [urlKey])
  }
  async getEntityByURLKey(urlKey: string): Promise<Product | Category | null> {
    const result = await this.getByURLKey(urlKey)
    return result?.hits?.[0] || null
  }
  find(field: string, value: string[] | number[]): Promise<CatalogResult> {
    const terms: any = {}
    terms[field] = value
    const body = { query: { terms } }
    return this.search(body)
  }
  jsonToModel(hit: any): Product | Category {
    if (hit._index.includes('category')) {
      return new Category(hit)
    } else {
      return new Product(hit)
    }
  }
}
