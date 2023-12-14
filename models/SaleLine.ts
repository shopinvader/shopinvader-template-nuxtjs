import { Model, SaleProduct, SaleAmount, SaleDiscount, SaleUnitPrice } from '#models'

export class SaleLine extends Model {
  id: number
  name: string
  productId: number
  qty: number
  qtyDelivered: number
  qtyUnavailable: number
  qtyCanceled: number
  product: SaleProduct
  amount: SaleAmount
  discount: SaleDiscount | null
  unitPrice: SaleUnitPrice
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.qty = data?.qty
    this.qtyDelivered = data?.qty_delivered
    this.qtyUnavailable = data?.qty_unavailable
    this.qtyCanceled = data?.qty_canceled
    this.productId = data?.product_id
    this.product = new SaleProduct(data?.product || null)
    this.amount = new SaleAmount(data.amount || {})
    this.unitPrice = new SaleUnitPrice(data.unit_price || {})
    this.discount = data.discount ? new SaleDiscount(data.discount) : null
  }
}
