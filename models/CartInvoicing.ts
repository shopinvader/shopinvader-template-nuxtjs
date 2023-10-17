import { Address } from './Address'
import { Model } from '#models'

export class CartInvoicing extends Model {
  address: Address
  constructor(data: any) {
    super(data)
    this.address = new Address(data?.address || {})
  }
}
