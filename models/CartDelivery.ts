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
    this.fees = new CartAmount(data?.amount || {})
    this.method = new DeliveryCarrier(data?.selected_carrier || {})
    this.address = data?.address ? new Address(data?.address ) : null
  }
}
