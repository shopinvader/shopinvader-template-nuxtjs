import { Model } from '#models'

export class SaleUnitPrice extends Model {
  untaxedWithDiscount: number
  untaxed: number
  constructor(data: any) {
    super(data)
    this.untaxedWithDiscount = data?.untaxed_with_discount
    this.untaxed = data?.untaxed
  }
}
