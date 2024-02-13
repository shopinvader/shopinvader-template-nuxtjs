import { Model } from '#models'

export class CartAmount extends Model {
  discountTotal: number
  tax: number
  total: number
  totalWithoutDiscount: number
  untaxed: number

  constructor(data: any) {
    super(data)
    this.discountTotal = data?.discount_total || 0
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
    this.totalWithoutDiscount = data?.total_without_discount || 0
  }
}
