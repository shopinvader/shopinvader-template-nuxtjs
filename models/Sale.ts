import { Address } from './Address'

export class SaleInvoicing {
  address: Address
  constructor (data: any) {
    this.address = data.address ? new Address(data.address) : null
  }
}

export class SaleShippingAmount {
  tax: number
  untaxed: number
  total: number
  constructor (data: any) {
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
  }
}

export class SaleShippingCarrier {
  id: number
  name: string
  description: string
  type: string
  code: string
  constructor (data: any) {
    this.id = data?.id
    this.name = data?.name
    this.description = data?.description
    this.type = data?.type
    this.code = data?.code
  }
}

export class SaleShipping {
  address: Address
  amount: SaleShippingAmount
  selectedCarrier: SaleShippingCarrier
  constructor (data: any) {
    this.address = data.address ? new Address(data.address) : null
    this.amount = data.amount ? new SaleShippingAmount(data.amount) : null
    this.selectedCarrier = data.selected_carrier ? new SaleShippingCarrier(data.selected_carrier) : null
  }
}

export class SaleAmount {
  price: number
  tax: number
  untaxed: number
  total: number
  totalWithoutDiscount: number
  constructor (data: any) {
    this.price = data?.price
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
    this.totalWithoutDiscount = data?.total_without_discount
  }
}

export class SaleProductImage {
  src: string
  alt: string
  tag: string
  constructor (data: any) {
    this.src = data?.src
    this.alt = data?.alt
    this.tag = data?.tag
  }
}

export class SaleProductImageSet {
  small: SaleProductImage
  medium: SaleProductImage
  large: SaleProductImage
  constructor (data: any) {
    this.small = data.small ? new SaleProductImage(data.small) : null
    this.medium = data.small ? new SaleProductImage(data.medium) : null
    this.large = data.small ? new SaleProductImage(data.large) : null
  }
}

export class SaleProductModel {
  name: string
  constructor (data: any) {
    this.name = data?.name
  }
}

export class SaleProduct {
  id: number
  sku: string
  name: string
  shortName: string
  images: SaleProductImageSet[]
  model: SaleProductModel
  urlKey: string
  constructor (data: any) {
    this.id = data?.id
    this.sku = data?.sku
    this.name = data?.name
    this.shortName = data?.short_name
    this.images = []
    if (data && data.images) {
      data.images.forEach((image: any) => this.images.push(new SaleProductImageSet(image)))
    }
    this.model = data.model ? new SaleProductModel(data.model) : null
    this.urlKey = data?.url_key
  }
}

export class SaleDiscount {
  rate: number
  value: number
  constructor (data: any) {
    this.rate = data?.rate
    this.value = data?.value
  }
}
export class SaleUnitPrice {
  untaxedWithDiscount: number
  untaxed: number
  constructor (data: any) {
    this.untaxedWithDiscount = data?.untaxed_with_discount
    this.untaxed = data?.untaxed
  }
}

export class SaleItem {
  id: number
  qty: number
  qtyDelivered: number
  qtyUnavailable: number
  qtyCanceled: number
  product: SaleProduct
  amount: SaleAmount
  discount: SaleDiscount
  unitPrice: SaleUnitPrice
  constructor (data: any) {
    this.id = data?.id
    this.qty = data?.qty
    this.qtyDelivered = data?.qty_delivered
    this.qtyUnavailable = data?.qty_unavailable
    this.qtyCanceled = data?.qty_canceled
    this.product = data?.product ? new SaleProduct(data?.product) : null
    this.amount = new SaleAmount(data.amount || {})
    this.unitPrice = new SaleUnitPrice(data.unit_price || {})
    this.discount = data.discount ? new SaleDiscount(data.discount) : null
  }
}

export class SaleLines {
  count: number
  items: SaleItem[]
  constructor (data: any) {
    this.count = data?.count
    this.items = []
    if (data && data.items) {
      data.items.forEach((item: any) => this.items.push(new SaleItem(item)))
    }
  }
}

export class SaleInvoice {
  id: number
  name: string
  date: Date
  constructor (data: any) {
    this.id = data?.id
    this.name = data?.name
    this.date = data && data.date ? new Date(data.date) : null
  }
}

export class SalePaiementMode {
  id: number
  name: string
  constructor (data: any) {
    this.id = data?.id
    this.name = data?.name
  }
}

export class SalePaiement {
  mode: SalePaiementMode
  constructor (data: any) {
    this.mode = data.mode ? new SalePaiementMode(data.mode) : null
  }
}

export class Sale {
  id: number = null
  name: string
  date: Date
  state: string
  stateLabel: string
  note: boolean
  invoicing: SaleInvoicing
  invoices: SaleInvoice[]
  lines: SaleLines
  amount: SaleAmount
  shipping: SaleShipping
  customerRef: string
  suiteName: string
  payment: SalePaiement

  constructor (data: any) {
    this.id = data?.id
    this.name = data?.name
    this.date = data && data.date ? new Date(data.date) : null
    this.state = data?.state
    this.stateLabel = data?.state_label
    this.note = data?.note
    this.invoicing = data.invoicing ? new SaleInvoicing(data.invoicing) : null
    this.invoices = []
    if (data && data.invoices) {
      data.invoices.forEach((invoice: any) => this.invoices.push(new SaleInvoice(invoice)))
    }
    this.lines = data.lines ? new SaleLines(data.lines) : null
    this.amount = data.amount ? new SaleAmount(data.amount) : null
    this.shipping = data.shipping ? new SaleShipping(data.shipping) : null
    this.customerRef = data?.customer_ref
    this.suiteName = data?.suite_name
    this.payment = data.payment ? new SalePaiement(data.payment) : null
  }
}
