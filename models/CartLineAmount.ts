import { Model } from '#models'

export class CartLineAmount extends Model {
  untaxed: number
  total: number
  totalWithoutDiscount: number
  discountTotal: number
  tax: number
  constructor(data: any) {
    super(data)
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
    this.discountTotal = data?.discount_total || 0
    this.totalWithoutDiscount = data?.total_without_discount || 0
  }
}
