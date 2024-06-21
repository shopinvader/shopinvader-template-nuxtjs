import type { $Fetch } from 'ofetch'
import { ServiceLocalized } from './ServiceLocalized'

export class ServiceElastic extends ServiceLocalized {
  ofetch: $Fetch
  elasticBaseUrl: string
  elasticIndex: string[] | string
  elasticUrl: string

  constructor(
    isoLocale: string,
    ofetch: $Fetch,
    elasticBaseUrl: string,
    elasticIndex: string[] | string
  ) {
    super(isoLocale)
    this.ofetch = ofetch
    this.elasticBaseUrl = elasticBaseUrl
    this.elasticIndex = elasticIndex
    if (!this.elasticIndex) {
      throw new Error('Elastic index is required')
    }
    this.elasticUrl = this.buildLocalizedElasticUrl(elasticBaseUrl, elasticIndex)
  }

  // Change indexes' names to match the current locale
  changeLocale(isoLocale: string): void {
    super.changeLocale(isoLocale)
    this.elasticUrl = this.buildLocalizedElasticUrl(this.elasticBaseUrl, this.elasticIndex)
  }

  // Index name is localized with the current locale
  buildLocalizedElasticUrl(baseUrl: string, elasticIndex: string[] | string): string {
    const localizedIndex = Array.isArray(elasticIndex)
      ? elasticIndex.map((index) => index + '_' + this.currentIsoLocale).join(',')
      : elasticIndex + '_' + this.currentIsoLocale
    return baseUrl + '/' + localizedIndex + '/_search'
  }

  async elasticFind(field: string, value: any): Promise<any> {
    const terms: any = {}
    terms[field] = [value]
    return this.elasticSearch({
      query: {
        terms
      }
    })
  }

  async elasticSearch(body: any = null): Promise<any> {
    if (!body) {
      body = {
        query: {
          match_all: {}
        }
      }
    }
    return await this.ofetch(this.elasticUrl, {
      method: 'POST',
      body
    })
  }
}
