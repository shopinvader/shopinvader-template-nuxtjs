import { CartAmount } from './CartAmount'
import { DeliveryCarrier } from './DeliveryCarrier'
import { Address } from './Address'

export class CartDelivery {
  fees: CartAmount
  method: DeliveryCarrier
  address: Address
  constructor(data: any) {
    this.fees = new CartAmount(data?.fees || {})
    this.method = new DeliveryCarrier(data?.method || {})
    this.address = new Address(data?.address || {})
  }
}
