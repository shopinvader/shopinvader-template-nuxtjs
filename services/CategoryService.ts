import { Category, type CategoryResult } from '#models'
import esb, { MultiMatchQuery } from 'elastic-builder'
import { BaseServiceElastic } from './BaseServiceElastic'

export class CategoryService extends BaseServiceElastic {
  navCategories:Category[] | null = null

  async init(services: ShopinvaderServiceList) {
    this.services = services
    /** load and cached navigations categories */
    await this.getNavCategories()
  }
  async search(body: any): Promise<CategoryResult> {
    const result = await this.elasticSearch(body)
    const hits = result?.hits?.hits?.map((hit: any) => this.jsonToModel(hit._source))
    const total = result?.hits?.total?.value || 0
    const aggregations = result?.aggregations || null
    return { hits, total, aggregations }
  }

  /**
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

  getAll(maxSize = 100): Promise<CategoryResult> {
    const body = { query: { match_all: {} }, size: maxSize }
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
      .query(new MultiMatchQuery(['name', 'description'], query).type('phrase_prefix'))
    return await this.search(body.toJSON())
  }

  async getNavCategories(): Promise<Category[]> {
    if(this.navCategories == null) {
      const result = await this?.search({
        size: 20,
        query: {
          term: {
            level: 0
          }
        }
      })
      this.navCategories = result?.hits || []
    }
    return this.navCategories || []
  }

  jsonToModel(json: any): Category {
    return new Category(json)
  }
}
