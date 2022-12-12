export class CartLineUnitPrice {
  untaxed: number
  untaxedWithDiscount: number
  constructor(data: any) {
    this.untaxedWithDiscount = data?.untaxed_with_discount || 0
    this.untaxed = data?.untaxed || 0
  }
}