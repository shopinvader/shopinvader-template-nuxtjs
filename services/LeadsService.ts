import type { $Fetch } from 'ofetch'
import { Lead, type LeadsResult } from '#models'
import { BaseServiceLocalized } from './BaseServiceLocalized'


export class LeadsService extends BaseServiceLocalized {
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

  async create(lead: Lead, files: FileList | null): Promise<LeadsResult> {
    const data = lead.getJSONData()
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    if (files) {
      formData.append(`files`, files[0])
    }
    const result = await this.ofetch("leads", {
      method: "POST",
      body: formData
    })
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Lead(item))
    } as LeadsResult
  }
}
