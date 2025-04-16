import { Model, DeliveryCarrier, type Product } from '#models'

export class PickingLine extends Model {
  productId: number | null = null
  productName: string
  state: string
  quantity: number
  quantityDone: number
  product: Product | null = null
  constructor(data: any) {
    super(data)
    this.productId = data?.product_id || null
    this.productName = data?.product_name || ''
    this.state = data?.state || ''
    this.quantity = data?.qty
    this.quantityDone = data?.qty_done
  }
}

export class Picking extends Model {
  id: number | null = null
  saleId: number | null = null
  name: string
  state: string
  deliveryDate: Date | null
  trackingReference: string | null
  carrier: DeliveryCarrier | null
  lines: PickingLine[] = []
  constructor(data: any) {
    super(data)
    this.id = data?.delivery_id || null
    this.name = data?.name || ''
    this.state = data?.state || ''
    this.trackingReference = data?.tracking_reference || null
    this.deliveryDate = data?.delivery_date ? new Date(data.delivery_date) : null
    this.carrier = data?.carrier ? new DeliveryCarrier(data.carrier) : null
    this.saleId = data?.sale_id || null
    this.lines = data?.lines ? data.lines.map((line: any) => new PickingLine(line)) : []
  }
}
