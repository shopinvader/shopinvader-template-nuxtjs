import { Model } from '#models'

export class SaleInvoice extends Model {
  id: number
  name: string
  date: Date | null
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.date = data && data.date ? new Date(data.date) : null
  }
}
