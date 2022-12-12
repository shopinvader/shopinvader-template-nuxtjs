import { ElasticFetch } from '@shopinvader/fetch'
import { Product, ProductResult } from '../models/Product'

export class ProductService {
  provider: ElasticFetch = null
  constructor(provider: ElasticFetch) {
    this.provider = provider
  }
  async search(body: any): Promise<ProductResult> {
    if (this.provider == null) {
      throw new Error('No provider found for products')
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
      const variants = hit?.inner_hits?.variants?.hits?.hits?.map((variant: any) => variant._source)
      return this.jsonToModel({
        ...hit._source,
        ...{ variants }
      })
    })
    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations }
  }

  /**
   * 
   * @param field 
   * @param value 
   * @returns 
   */
  find(field: string, value: string[] | number[]): Promise<ProductResult> {
    const terms: any = {}
    terms[field] = value
    const body = { query: { terms } }
    return this.search(body)
  }

  getAll(): Promise<ProductResult> {
    const body = { query: { match_all: {} } }
    return this.search(body)
  }

  getByIds(ids: number[]): Promise<ProductResult> {
    const body: any = {
      query: {
        terms: { id: ids }
      },
      size: ids.length
    }
    return this.search(body)
  }

  async getByURLKey(urlKey: string): Promise<Product | null> {
    const result: ProductResult = await this.find('url_key', [urlKey])
    if (result?.hits?.length > 0) {
      return result?.hits?.[0]
    }
    return null
  }

  jsonToModel(json: any): Product {
    return new Product(json)
  }
}
