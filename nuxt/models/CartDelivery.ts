import { CartAmount } from './CartAmount'
import { DeliveryCarrier } from './DeliveryCarrier'
import { Address } from './Address'
import { Model } from './Model'

export class CartDelivery extends Model {
  fees: CartAmount
  method: DeliveryCarrier
  address: Address
  constructor(data: any) {
    super(data)
    this.fees = new CartAmount(data?.fees || {})
    this.method = new DeliveryCarrier(data?.method || {})
    this.address = new Address(data?.address || {})
  }
}
