import {
  CartLine,
  CartAmount,
  CartLinesAmount,
  CartDiscount,
  CartInvoicing,
  CartDelivery,
  Model
} from '#models'

export class Cart extends Model {
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
  orderRef: string = ''
  hasPendingTransactions = false
  hasSyncError = false
  syncing = false
  syncError = false
  /** Fill fields with data from the Json provided by ElasticSearch */
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.uuid = data?.uuid
    this.name = data?.name
    this.date = new Date(data?.date)
    let lines = []
    if (Array.isArray(data?.lines)) {
      lines = data?.lines?.map((l: any) => new CartLine(l)) || []
    }
    this.lines = lines
    this.linesCount = Cart.getLinesCount(lines)
    if(data?.amount_without_delivery) {
      this.linesAmount = new CartLinesAmount(data?.amount_without_delivery || {})
    } else {
      this.linesAmount = Cart.getLinesAmount(lines)
    }
    this.loaded = false
    this.amount = new CartAmount(data?.amount || {})
    this.discount = new CartDiscount(data?.discount || {})
    this.delivery = new CartDelivery({address: data?.delivery?.address} || {})
    this.invoicing = new CartInvoicing({address: data?.invoicing?.address} || {})
    this.note = data?.note
    this.orderRef = data?.client_order_ref || ''
  }

  private static getLinesAmount(lines: CartLine[]): CartLinesAmount {
    let total = 0
    let untaxed = 0
    let tax = 0

    for (const item of lines) {
      total += item.amount.total
      untaxed += item.amount.untaxed
      tax += item.amount.tax
    }
    return new CartLinesAmount({total, untaxed, tax})
  }

  private static getLinesCount(lines: CartLine[]): number {
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
    cart.linesCount = Cart.getLinesCount(lines)
  }
}
