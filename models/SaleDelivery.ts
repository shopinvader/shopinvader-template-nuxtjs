import { Address, Model, SaleDeliveryAmount, SaleDeliveryCarrier } from '#models'
export class SaleDelivery extends Model {
  address: Address | null
  amount: SaleDeliveryAmount | null
  selectedCarrier: SaleDeliveryCarrier | null
  constructor(data: any) {
    super(data)
    this.address = data.address ? new Address(data.address) : null
    this.amount = data.amount ? new SaleDeliveryAmount(data.amount) : null
    this.selectedCarrier = data.selected_carrier
      ? new SaleDeliveryCarrier(data.selected_carrier)
      : null
  }
}
