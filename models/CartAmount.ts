import { Model } from '#models'

export class CartAmount extends Model {
  discount_total: number
  tax: number
  total: number
  totalWithoutDiscount: number
  untaxed: number
  carrier: null

  constructor(data: any) {
    super(data)
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
    this.totalWithoutDiscount = data?.total_without_discount || 0
    this.carrier = null
  }
}
