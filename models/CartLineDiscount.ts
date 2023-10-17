import { Model } from '#models'

export class CartLineDiscount extends Model {
  value: number
  rate: number
  constructor(data: any) {
    super(data)
    this.rate = data?.rate || 0
    this.value = data?.value || 0
  }
}
