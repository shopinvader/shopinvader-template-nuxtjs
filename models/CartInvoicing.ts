import { Address } from './Address'

export class CartInvoicing {
  address: Address
  constructor(data: any) {
    this.address = new Address(data?.address || {})
  }
}
