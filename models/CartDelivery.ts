import { CartAmount } from './CartAmount'
import { Carrier } from './Carrier'
import { Address } from './Address'

export class CartDelivery {
  fees: CartAmount
  method: Carrier
  address: Address
  constructor(data: any) {
    this.fees = new CartAmount(data?.fees || {})
    this.method = new Carrier(data?.method || {})
    this.address = new Address(data?.address || {})
  }
}
