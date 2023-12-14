import { Model } from '#models'

export class SaleDiscount extends Model {
  rate: number
  value: number
  constructor(data: any) {
    super(data)
    this.rate = data?.rate
    this.value = data?.value
  }
}
