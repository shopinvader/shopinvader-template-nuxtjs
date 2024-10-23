import { BaseServiceLocalized } from '#services'
import type { $Fetch } from 'ofetch'

export class BaseServiceErp extends BaseServiceLocalized {
  public ofetch: $Fetch
  // Base url of the erp API (eg; https://myerp.mycompany.com/shopinvader)
  public erpBaseUrl: string
  // Note: you can change the endpoint to match your API endpoint before the Init
  public endpoint: string = ''
  // The urlEndpoint is the erpBaseUrl + the endpoint
  public urlEndpoint: string = ''

  constructor(isoLocale: string, ofetch: $Fetch, erpBaseUrl: string) {
    super(isoLocale)
    this.ofetch = ofetch
    this.erpBaseUrl = erpBaseUrl
  }

  override init(services: ShopinvaderServiceList): void {
    super.init(services)
    this.urlEndpoint = this.buildUrlEndpoint(this.erpBaseUrl, this.endpoint)
  }

  buildUrlEndpoint(baseUrl: string, entrypoint: string): string {
    return (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + entrypoint
  }
}
