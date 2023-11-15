import {
  CartAmount,
  DeliveryCarrier,
  Address,
  Model
} from '#models'

export class CartDelivery extends Model {
  fees: CartAmount
  method: DeliveryCarrier
  address: Address | null
  constructor(data: any) {
    super(data)
    this.fees = new CartAmount(data?.fees || {})
    this.method = new DeliveryCarrier(data?.method || {})
    this.address = data?.address ? new Address(data?.address ) : null
  }
}
