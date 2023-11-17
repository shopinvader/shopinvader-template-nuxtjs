import { ElasticFetch } from '@shopinvader/fetch'
import esb, { Aggregation, MultiMatchQuery, Query, TermQuery } from 'elastic-builder'
import { Product, ProductResult, VariantAttributes } from '#models'
import { Service } from '#services'

export class ProductService extends Service {
  name = 'products'
  provider: ElasticFetch | null = null
  constructor(provider: ElasticFetch) {
    super()
    this.provider = provider
  }
  hits(hits: any[]) {
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
  fullTextQuery(query: string): Query {
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
      .query(this.fullTextQuery(query))
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

  async getVariantsAggregation(urlKey:string, axes:VariantAttributes) {
    const aggs = []
    let i =0
    for(let axis in axes) {
      const axesValues = Object.entries(axes).slice(0, i)
      let agg:Aggregation = esb.termsAggregation(axis, `variant_attributes.${axis}`).size(1000).order('_term', 'asc')
      if(axesValues?.length > 0) {
        const query = esb.boolQuery().must(
          axesValues.map(([key, value]) =>  esb.termQuery(`variant_attributes.${key}`, value))
        )
        agg = esb.filterAggregation(axis, query).agg(agg)
      }
      aggs.push(agg)
      i++
    }
    const body = esb
      .requestBodySearch()
      .collapse('url_key', esb.innerHits('variants').size(0), 4)
      .query(new TermQuery('url_key', urlKey))
      .postFilter(
        esb.nestedQuery()
        .path('variant_attributes')
        .query(
          esb.boolQuery()
          .must(
            Object.entries(axes).map(([key, value]) =>  esb.termQuery(`variant_attributes.${key}`, value))
          )
        )
      )
      .agg(
        esb.nestedAggregation('variants', 'variant_attributes').aggs(aggs)
      )
      .size(1)
    const result = await this.search(body.toJSON())
    const { aggregations, hits } = result
    const items:any = {}
    for(let axis in axes) {

      let axisValues = aggregations.variants[axis]
      if(axisValues?.[axis]) {
        axisValues = axisValues[axis]
      }
      items[axis] = axisValues?.buckets?.map((bucket:any) => bucket.key) || []
    }
    return {
      axes:items,
      product: hits?.[0] || null
    }
  }

  jsonToModel(json: any): Product {
    const role = this.store()?.getCurrentRole
    return new Product(json, role)
  }
}
