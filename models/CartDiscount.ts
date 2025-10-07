import { Model } from '#models'

export class CartDiscount extends Model {
  value: number
  taxIncluded: number
  constructor(data: any) {
    super(data)
    this.value = data?.discount_untaxed || 0
    this.taxIncluded = data?.discount_total || 0
  }
}
