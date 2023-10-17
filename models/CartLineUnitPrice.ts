import { Model } from '#models'

export class CartLineUnitPrice extends Model {
  untaxed: number
  untaxedWithDiscount: number
  constructor(data: any) {
    super(data)
    this.untaxedWithDiscount = data?.untaxed_with_discount || 0
    this.untaxed = data?.untaxed || 0
  }
}
