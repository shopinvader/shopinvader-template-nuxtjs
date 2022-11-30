import { ElasticFetch, ErpFetch } from "@shopinvader/fetch"

interface ShopinvaderFetch {
  [key: string]: ErpFetch | ElasticFetch
}

export class ShopinvaderProviders {
  providers: ShopinvaderFetch

  constructor() {
    this.providers = {}
  }

  register(name: string, provider: ErpFetch | ElasticFetch) {
    this.providers[name] = provider
  }

  get(name: string) {
    return this.providers[name]
  }
}