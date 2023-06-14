export class InfoBanner {
  message: string | null = null
  startDate: Date
  endDate: Date
  id: number
  constructor(data: any) {
    this.id = data?.id || 0
    this.message = data?.message || null
    this.startDate = data?.startDate ? new Date(data?.startDate) : new Date()
    this.endDate = data?.endDate ? new Date(data?.endDate) : new Date()
  }
}
