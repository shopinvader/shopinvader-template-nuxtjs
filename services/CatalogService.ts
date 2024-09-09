import { Category, Product, type CatalogResult } from '#models'
import { Service } from '#services'
import type { ElasticFetch } from '@shopinvader/fetch'

export class CatalogService extends Service {
  serviceName = 'catalog'
  provider: ElasticFetch | null = null
  constructor(provider: ElasticFetch) {
    super()
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
      const variants = hit?.inner_hits?.variants?.hits?.hits?.map((variant: any) => variant._source)
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
  getByURLKey(urlKey: string, sku: string | null): Promise<CatalogResult> {
    const bool: any = {
      should: [
        {
          terms: {
            url_key: [urlKey]
          }
        },
        {
          terms: {
            redirect_url_key: [urlKey]
          }
        }
      ]
    }
    let query: any = { bool }
    if (sku) {
      /** Boost product with specific SKU */
      query = {
        bool: {
          must: [{ bool }],
          should: [
            {
              terms: {
                'sku.keyword': [sku]
              }
            }
          ]
        }
      }
    }
    return this.search({ query })
  }
  async getEntityByURLKey(urlKey: string, sku: string | null): Promise<Product | Category | null> {
    const result = await this.getByURLKey(urlKey, sku)
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
      const role = this.store()?.getCurrentRole
      return new Product(hit, role)
    }
  }
}
