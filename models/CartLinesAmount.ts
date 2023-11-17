import { Model } from '#models'

export class CartLinesAmount extends Model {
  tax: number
  total: number
  untaxed: number
  constructor(data: any) {
    super(data)
    this.tax = data?.tax || 0
    this.total = data?.total || 0
    this.untaxed = data?.untaxed || 0
  }
}
