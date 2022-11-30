import { ShopinvaderServiceList } from './ShopinvaderServiceList'
import { Newable } from './ShopinvaderService'
import { ShopinvaderOptions } from './config'
import { ErpFetch, ElasticFetch } from '@shopinvader/fetch'

interface ShopinvaderFetch {
  [key: string]: ErpFetch | ElasticFetch
}

export class Shopinvader {
  options: ShopinvaderOptions
  providers: ShopinvaderFetch
  services: ShopinvaderServiceList = {}
  constructor(options: ShopinvaderOptions, fetchFunction: Function) {
    this.providers = {}
    this.options = options
    this.initProviders(fetchFunction)
  }

  private initProviders(fetchFunction: Function) {
    const { erp, elasticsearch } = this.options
    if (erp) {
      this.registerProvider('erp', new ErpFetch(erp.api_url, erp?.website_key || '', fetchFunction)
      )
    }
    const elasticIndices: string[] = []
    if (elasticsearch?.indices.length > 0) {
      for (const index of elasticsearch.indices) {
        this.registerProvider(index.name, new ElasticFetch(elasticsearch.url, index.index, fetchFunction))
        elasticIndices.push(index.index)
      }
      console.log('elasticIndices', elasticIndices)
      this.registerProvider('elastic', new ElasticFetch(elasticsearch.url, elasticIndices.join(','), fetchFunction))
    }
  }
  registerProvider(name: string, provider: ErpFetch | ElasticFetch) {
    this.providers[name] = provider
  }
  getProvider(name: string) {
    return this.providers[name]
  }
  registerService<K extends string, S, M>(key: K, Service: Newable<S>) {
    (this.services as any)[key] = new Service(this.providers, this.services)
  }
}
//constructor (baseUrl, websiteKey, transport) {