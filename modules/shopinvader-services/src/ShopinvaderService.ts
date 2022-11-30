import { ShopinvaderProviders } from './ShopinvaderProviders'
import { ShopinvaderServiceList } from './ShopinvaderServiceList'
import { ElasticFetch } from "@shopinvader/fetch"

export type Newable<T> = { new(...args: any[]): T; };

export class ShopinvaderService {
  providers: ShopinvaderProviders
  services: ShopinvaderServiceList
  Model: any
  constructor(providers: ShopinvaderProviders, services: ShopinvaderServiceList) {
    this.providers = providers
    this.services = services
  }
}

