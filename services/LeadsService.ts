import { Lead, type LeadsResult } from '#models'
import { BaseServiceErp } from '#services'

export class LeadsService extends BaseServiceErp {
  public override endpoint: string = 'leads'

  async create(lead: Lead, files: FileList | null): Promise<LeadsResult> {
    const data = lead.getJSONData()
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    if (files) {
      formData.append(`files`, files[0])
    }
    const result = await this.ofetch('leads', {
      method: 'POST',
      body: formData
    })
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Lead(item))
    } as LeadsResult
  }
}
