import {
  Product,
  CartLineAmount,
  CartLineDiscount,
  CartLineUnitPrice,
  Model
} from '#models'

export class CartLine extends Model {
  // Standard fields
  id: number
  name: string | null
  amount: CartLineAmount
  productId: number | null
  discount: CartLineDiscount | null
  qty: number
  qtyUnavailable: number
  qtyUnavailableDiff: number
  hasPendingTransactions: boolean | null
  product: Product | null
  unitPrice: CartLineUnitPrice
  options: any[] | null
  /** Fill fields with data from the Json provided by ElasticSearch */
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.amount = new CartLineAmount(data?.amount || {})
    this.discount = new CartLineDiscount(data?.discount || {})
    this.unitPrice = new CartLineUnitPrice(data?.unit_price || {})
    this.productId = data?.product_id
    this.discount = data?.discount || null
    this.qty = data?.qty || 0
    this.qtyUnavailable = data?.qty_unavailable || 0
    this.qtyUnavailableDiff = data?.qty_unavailable_diff || 0
    this.hasPendingTransactions = data?.hasPendingTransactions || false
    this.product = null
    this.options = data?.options || null
  }
}
