import { ErpFetch } from '@shopinvader/fetch'
import { Lead, LeadsResult } from '#models'
import { Service } from '#services'

export class LeadsService extends Service {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  async create(lead: Lead): Promise<LeadsResult> {
    const data = lead.getJSONData()
    const result = await this.provider?.post('leads', data)
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Lead(item))
    } as LeadsResult
  }
}
