import type { $Fetch } from 'ofetch'
import { BaseServiceLocalized } from './BaseServiceLocalized'

export class BaseServiceElastic extends BaseServiceLocalized {
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
  override changeLocale(isoLocale: string): void {
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
    const res = await this.ofetch(this.elasticUrl, {
      method: 'POST',
      body
    })
    // Check for errors in the response
    const errors = this.findFailureInElasticResponse(res)
    if (errors) {
      // Warn about the errors
      console.warn('ElasticSearch error(s):', errors)
    }
    return res
  }

  // Recursively search for 'failures' or 'failed_shards' fields somewhere deep in the response and concat errors from them
  findFailureInElasticResponse(response: any): string | null {
    const searchFailures = (level: number, obj: any): string => {
      let errors = ''
      for (const key in obj) {
        if (key === 'failures' || key === 'failed_shards') {
          // if it's an array, concat all the messages
          if (Array.isArray(obj[key])) {
            errors += obj[key]
              .map((item: any) => `${item?.index}: ${item?.reason?.reason}`)
              .join('; ')
          } else {
            errors += JSON.stringify(obj[key])
          }
        } else if (level < 1 && typeof obj[key] === 'object') {
          // Go deeper only once for optimization
          errors += searchFailures(level + 1, obj[key])
        }
      }
      return errors
    }
    const res = searchFailures(0, response)
    return res || null
  }
}
