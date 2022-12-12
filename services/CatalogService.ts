import { ElasticFetch } from '@shopinvader/fetch'
import { Category } from '~~/models/Category'
import { Product } from '~~/models/Product'
import { CatalogResult } from '~~/models/Catalog'

export class CatalogService {
  provider: ElasticFetch = null
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
          name: "variants"
        }
      ]
    }
    const result = await this.provider?.search(body)
    const hits = result?.hits?.hits?.map((hit: any) => {
      if (hit._index.includes('category')) {
        return new Category(hit._source)
      } else {
        const variants = hit?.inner_hits?.variants?.hits?.hits?.map((variant: any) => variant._source)
        return new Product({
          ...hit._source,
          ...{ variants }
        })
      }
    })
    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations }
  }
  getByURLKey(urlKey: string): Promise<CatalogResult> {
    return this.find('url_key', [urlKey])
  }
  find(field: string, value: string[] | number[]): Promise<CatalogResult> {
    const terms: any = {}
    terms[field] = value
    const body = { query: { terms } }
    return this.search(body)
  }
}