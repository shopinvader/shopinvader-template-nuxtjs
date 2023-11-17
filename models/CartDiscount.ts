import { Model } from '#models'

export class CartDiscount extends Model {
  value: number
  constructor(data: any) {
    super(data)
    this.value = data?.value || 0
  }
}
