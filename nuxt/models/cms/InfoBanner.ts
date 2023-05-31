import { CMSObject } from './CMSObject'

export class InfoBanner extends CMSObject {
  message: string | null = null
  startDate: Date
  endDate: Date
  id: number
  constructor(data: any) {
    super(data)
    this.id = data?.id || 0
    this.message = data?.message || null
    this.startDate = data?.startDate ? new Date(data?.startDate) : new Date()
    this.endDate = data?.endDate ? new Date(data?.endDate) : new Date()
  }
}
