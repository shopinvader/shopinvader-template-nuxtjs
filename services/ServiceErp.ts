import type { $Fetch } from 'ofetch'
import { ServiceLocalized } from './ServiceLocalized'

export class ServiceErp extends ServiceLocalized {
  public ofetch: $Fetch
  public erpBaseUrl: string
  // Note: you can change the endpoint to match your API endpoint before the Init
  public endpoint: string = ''
  // The apiUrl is the baseUrl + the endpoint
  public urlEndpoint: string = ''

  // baseUrl is the base url of the erp API (eg; https://myerp.mycompany.com/shopinvader)
  constructor(isoLocale: string, ofetch: $Fetch, erpBaseUrl: string) {
    super(isoLocale)
    this.ofetch = ofetch
    this.erpBaseUrl = erpBaseUrl
  }

  init(services: ShopinvaderServiceList): void {
    super.init(services)
    this.urlEndpoint = this.buildUrlEndpoint(this.erpBaseUrl, this.endpoint)
  }

  buildUrlEndpoint(baseUrl: string, entrypoint: string): string {
    return (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + entrypoint
  }
}
