import { Model } from '#models'

export class PaymentIcon extends Model {
  sequence: number
  name: string
  image: string

  constructor(data: any) {
    super(data)
    this.sequence = data?.sequence || 0
    this.name = data?.name || ''
    this.image = data?.image || ''
  }
}
