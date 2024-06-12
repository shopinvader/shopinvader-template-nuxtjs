import { Address, Model } from '#models'

export class SaleInvoicing extends Model {
  address: Address | null
  constructor(data: any) {
    super(data)
    this.address = data.address ? new Address(data.address) : null
  }
}
