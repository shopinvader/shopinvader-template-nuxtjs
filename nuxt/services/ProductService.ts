import { ElasticFetch } from '@shopinvader/fetch'
import { Product, ProductResult } from '../models/Product'
import esb, { MultiMatchQuery, Query } from 'elastic-builder'

export class ProductService {
  provider: ElasticFetch | null = null
  constructor(provider: ElasticFetch) {
    this.provider = provider
  }
  private hits(hits: any[]) {
    return hits?.map((hit: any) => {
      const variants = hit?.inner_hits?.variants?.hits?.hits?.map(
        (variant: any) => variant._source
      )
      return this.jsonToModel({
        ...hit._source,
        ...{ variants }
      })
    })
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
          name: 'variants'
        }
      ]
    }
    const result = await this.provider?.search(body)
    const hits = this.hits(result?.hits?.hits || [])
    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations }
  }
  static fullTextQuery(query: string): Query {
    return new MultiMatchQuery(['name', 'description'], query).type(
      'phrase_prefix'
    )
  }
  async autocompleteSearch(
    query: string,
    limit: number
  ): Promise<ProductResult> {
    const body = esb
      .requestBodySearch()
      .collapse('url_key', esb.innerHits('variants').size(100), 4)
      .suggest(esb.termSuggester('suggestion', 'name', query))
      .query(ProductService.fullTextQuery(query))
      .size(limit)

    const result = await this.provider?.search(body.toJSON())
    const hits = this.hits(result?.hits?.hits || [])
    const aggregations = result?.aggregations || null
    const total = result?.hits?.total?.value || 0
    const suggestions = result?.suggest?.suggestion || []
    return { hits, total, aggregations, suggestions }
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
    if (ids.length > 0) {
      const body: any = {
        query: {
          terms: { id: ids }
        },
        size: ids.length
      }
      return this.search(body)
    } else {
      return new Promise((resolve) => {
        resolve({ hits: [], total: 0, aggregations: null, suggestions: [] })
      })
    }
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
