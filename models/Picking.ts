import { Model, DeliveryCarrier } from '#models'

export class Picking extends Model {
  id: number | null = null
  saleId: number | null = null
  name: string
  deliveryDate: Date | null
  trackingReference: string | null
  deiveryDate: Date | null
  carrier: DeliveryCarrier | null
  constructor(data: any) {
    super(data)
    this.id = data?.delivery_id || null
    this.name = data?.name || ''
    this.trackingReference = data?.tracking_reference || null
    this.deliveryDate = data?.delivery_date ? new Date(data.delivery_date) : null
    this.carrier = data?.carrier ? new DeliveryCarrier(data.carrier) : null
    this.saleId = data?.sale_id || null
  }
}
