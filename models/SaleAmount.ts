import { Model } from '#models'

export class SaleAmount extends Model {
  price: number
  tax: number
  untaxed: number
  total: number
  discount_total: number
  totalWithoutDiscount: number
  constructor(data: any) {
    super(data)
    this.price = data?.price
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
    this.discount_total = data?.discount_total
    this.totalWithoutDiscount = data?.total_without_discount
  }
}
