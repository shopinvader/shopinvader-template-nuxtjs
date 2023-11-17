import { Model } from '#models'

export class PaymentMode extends Model {
  id: number
  name: string
  code: string
  description: string
  constructor(data: any) {
    super(data)
    this.id = data?.id || 0
    this.name = data?.name || ''
    this.code = data?.code || ''
    this.description = data?.description || ''
  }
}
