import { ErpFetch } from '@shopinvader/fetch'
import { Lead, type LeadsResult } from '#models'
import { Service } from '#services'

export class LeadsService extends Service {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  async create(lead: Lead, files: FileList | null): Promise<LeadsResult> {
    const data = lead.getJSONData()
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    if (files) {
      formData.append(`files`, files[0])
    }
    const result = await this.provider?.post("leads", formData)
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Lead(item))
    } as LeadsResult
  }
}
