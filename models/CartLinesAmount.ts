export class CartLinesAmount {
  tax: number
  total: number
  untaxed: number
  constructor(data: any) {
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
  }
}
