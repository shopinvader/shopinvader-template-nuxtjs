import { ElasticFetch } from '@shopinvader/fetch'
import { Category, CategoryResult } from '#models'
import esb, { MultiMatchQuery } from 'elastic-builder'

export class CategoryService {
  name = 'categories'
  provider: ElasticFetch | null = null
  constructor(provider: ElasticFetch) {
    this.provider = provider
  }
  async search(body: any): Promise<CategoryResult> {
    if (this.provider == null) {
      throw new Error('No provider found for categories')
    }
    const result = await this.provider?.search(body)
    const hits = result?.hits?.hits?.map((hit: any) =>
      this.jsonToModel(hit._source)
    )
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
  find(field: string, value: string[] | number[]): Promise<CategoryResult> {
    const terms: any = {}
    terms[field] = value
    const body = { query: { terms } }
    return this.search(body)
  }

  getByIds(ids: number[]): Promise<CategoryResult> {
    const body: any = {
      query: {
        terms: { id: ids }
      },
      size: ids.length
    }
    return this.search(body)
  }

  getAll(): Promise<CategoryResult> {
    const body = { query: { match_all: {} } }
    return this.search(body)
  }

  async getByURLKey(urlKey: string): Promise<Category | null> {
    const result: CategoryResult = await this.find('url_key', [urlKey])
    if (result?.hits?.length > 0) {
      return result?.hits?.[0]
    }
    return null
  }
  async autocompleteSearch(query: string): Promise<CategoryResult> {
    const body = esb
      .requestBodySearch()
      .query(
        new MultiMatchQuery(['name', 'description'], query).type(
          'phrase_prefix'
        )
      )
    return await this.search(body.toJSON())
  }
  jsonToModel(json: any): Category {
    return new Category(json)
  }
}
