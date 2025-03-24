import { Category, Product, type CatalogResult } from '#models'
import { BaseServiceElastic } from '#services'

export class CatalogService extends BaseServiceElastic {
  async search(body: any): Promise<CatalogResult> {
    body = {
      ...(body || {}),
      collapse: {
        field: 'url_key',
        inner_hits: [
          {
            size: 100,
            name: 'variants'
          }
        ]
      }
    }
    const result = await this.elasticSearch(body)
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

  /**
   * Get product or category by URL key or redirect URL key
   * Boost product with specific SKU
   */
  getByURLKey(urls: string | string[], sku: string | null): Promise<CatalogResult> {
    urls = Array.isArray(urls) ? urls : [urls]
    const bool: any = { should: [] }
    let boost = urls?.length
    for (const field of ['url_key', 'redirect_url_key']) {
      for (const url of urls) {
        bool.should.push({
          terms: {
            [field]: [url],
            boost
          }
        })
      }
      boost--
    }
    let query: any = { bool }
    if (sku) {
      // Boost product with specific SKU
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
    } else {
      query = {
        bool: {
          must: [{ bool }],
          should: [
            {
              terms: {
                main: [true]
              }
            }
          ]
        }
      }
    }
    return this.search({ query })
  }
  /**
   * Get entity by URL key. Search in URL key and redirect URL key.
   * Search also by cleaned URL key (removed end slash and index.html)
   */
  async getEntityByURLKey(urlKey: string, sku: string | null): Promise<Product | Category | null> {
    const urls = [urlKey]
    // Clean URL (remove end slash and index.html) to get the right entity
    const cleanedURL = this.cleanURL(urlKey)
    if (cleanedURL !== urlKey) {
      urls.push(cleanedURL)
    }

    const result = await this.getByURLKey(urls, sku)
    const entity = result?.hits?.[0] || null
    if (entity && cleanedURL !== urlKey) {
      // Add URL to redirectUrlKey to redirect to the cleaned URL
      entity.redirectUrlKey.push(urlKey)
    }
    return entity
  }

  /**
   * Cleans the URL to remove the trailing slash or .html .htm extension
   * */
  cleanURL(url: string): string {
    return url.replace(/\/(index\.html?|)\/?$/, '')
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
