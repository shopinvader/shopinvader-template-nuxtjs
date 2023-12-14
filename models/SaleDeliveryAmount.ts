import { Model} from '#models'

export class SaleDeliveryAmount extends Model {
  tax: number
  untaxed: number
  total: number
  constructor(data: any) {
    super(data)
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
  }
}
