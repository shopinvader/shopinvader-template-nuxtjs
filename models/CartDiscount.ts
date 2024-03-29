import { Model } from '#models'

export class CartDiscount extends Model {
  value: number
  taxIncluded: number
  constructor(data: any) {
    super(data)
    this.value = data?.reward_amount || 0
    this.taxIncluded = data?.reward_amount_tax_incl || 0
  }
}
