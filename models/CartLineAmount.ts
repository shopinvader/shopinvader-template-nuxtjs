export class CartLineAmount {
  untaxed: number
  total: number
  totalWithoutDiscount: number
  tax: number
  constructor(data: any) {
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
    this.totalWithoutDiscount = data?.total_without_discount || 0
  }
}
