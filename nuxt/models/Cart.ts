import { CartLine } from './CartLine'
import { CartAmount } from './CartAmount'
import { CartLinesAmount } from './CartLinesAmount'
import { CartDiscount } from './CartDiscount'
import { CartInvoicing } from './CartInvoicing'
import { CartDelivery } from './CartDelivery'

export class Cart {
  // Standard fields
  name: string
  id: number
  uuid: string
  linesAmount: CartLinesAmount
  linesCount: number
  lines: CartLine[]
  date: Date
  loaded: boolean
  amount: CartAmount
  discount: CartDiscount
  invoicing: CartInvoicing
  delivery: CartDelivery
  note: string
  data: any
  hasPendingTransactions = false
  hasSyncError = false
  syncing = false
  syncError = false
  /** Fill fields with data from the Json provided by ElasticSearch */
  constructor(data: any) {
    this.data = data
    this.id = data?.id
    this.uuid = data?.uuid
    this.name = data?.name
    this.date = new Date(data?.date)
    let lines = []
    if (Array.isArray(data?.lines)) {
      lines = data?.lines?.map((l: any) => new CartLine(l)) || []
    }
    this.lines = lines
    this.linesCount = Cart.calcLinesCount(lines)
    this.linesAmount = new CartLinesAmount(data?.amount_without_delivery || {})
    this.loaded = false
    this.amount = new CartAmount(data?.amount || {})
    this.discount = new CartDiscount(data?.discount || {})
    this.delivery = new CartDelivery(data?.delivery || {})
    this.invoicing = new CartInvoicing(data?.invoicing || {})
    this.note = data?.note
  }

  private static calcLinesCount(lines: CartLine[]): number {
    let qty = 0
    for (const item of lines) {
      if (item.qty > 0) {
        qty += item.qty
      }
    }
    return qty
  }

  static setLines(cart: Cart, lines: CartLine[]) {
    cart.lines = lines
    cart.linesCount = Cart.calcLinesCount(lines)
  }

  // Prevent non-POJOs error
  toJSON() {
    return { ...this }
  }
}
