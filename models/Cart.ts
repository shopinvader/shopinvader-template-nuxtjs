import {
  CartLine,
  CartAmount,
  CartLinesAmount,
  CartDiscount,
  CartInvoicing,
  CartDelivery,
  Model,
  Address
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
  promoCodes: string[] = []
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
    if(data?.amount?.total_without_shipping_without_discount) {
      this.linesAmount = new CartLinesAmount({
        total: data?.amount?.total_without_shipping_without_discount,
        untaxed: data?.amount?.untaxed_without_shipping,
        tax: data?.amount?.tax_without_shipping
      })
    } else {
      this.linesAmount = Cart.getLinesAmount(lines)
    }
    this.loaded = false
    this.amount = new CartAmount(data?.amount || {})
    this.discount = new CartDiscount(data || {})
    this.delivery = new CartDelivery(data?.delivery || {})
    this.invoicing = new CartInvoicing({address: data?.invoicing?.address} || {})
    this.note = data?.note
    this.orderRef = data?.client_order_ref || ''
    this.promoCodes = data?.promo_codes || []
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
  hasValidAddresses() {
    const addresses = [this.invoicing?.address || null, this.delivery?.address || null]
    return addresses.every((address: (Address| null)) => address && address?.isValidAddress())
  }
  hasSameAddress() {
    return this.invoicing?.address?.id === this.delivery?.address?.id
  }
}
