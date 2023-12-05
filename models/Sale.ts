import { Model, Address } from '#models'

export class SaleInvoicing extends Model {
  address: Address | null
  constructor(data: any) {
    super(data)
    this.address = data.address ? new Address(data.address) : null
  }
}

export class SaleDeliveryAmount extends Model {
  tax: number
  untaxed: number
  total: number
  constructor(data: any) {
    super(data)
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
  }
}

export class SaleDeliveryCarrier extends Model {
  id: number
  name: string
  description: string
  type: string
  code: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.description = data?.description
    this.type = data?.type
    this.code = data?.code
  }
}

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

export class SaleAmount extends Model {
  price: number
  tax: number
  untaxed: number
  total: number
  totalWithoutDiscount: number
  constructor(data: any) {
    super(data)
    this.price = data?.price
    this.tax = data?.tax
    this.untaxed = data?.untaxed
    this.total = data?.total
    this.totalWithoutDiscount = data?.total_without_discount
  }
}

export class SaleProductImage extends Model {
  src: string
  alt: string
  tag: string
  constructor(data: any) {
    super(data)
    this.src = data?.src
    this.alt = data?.alt
    this.tag = data?.tag
  }
}

export class SaleProductImageSet extends Model {
  small: SaleProductImage | null
  medium: SaleProductImage | null
  large: SaleProductImage | null
  constructor(data: any) {
    super(data)
    this.small = data.small ? new SaleProductImage(data.small) : null
    this.medium = data.small ? new SaleProductImage(data.medium) : null
    this.large = data.small ? new SaleProductImage(data.large) : null
  }
}

export class SaleProductModel extends Model {
  name: string
  constructor(data: any) {
    super(data)
    this.name = data?.name
  }
}

export class SaleProduct extends Model {
  id: number
  sku: string
  name: string
  shortName: string
  images: SaleProductImageSet[]
  model: SaleProductModel
  urlKey: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.sku = data?.sku
    this.name = data?.name
    this.shortName = data?.short_name
    this.images = []
    if (data && data.images) {
      data.images.forEach((image: any) =>
        this.images.push(new SaleProductImageSet(image))
      )
    }
    this.model = new SaleProductModel(data?.model || null)
    this.urlKey = data?.url_key
  }
}

export class SaleDiscount extends Model {
  rate: number
  value: number
  constructor(data: any) {
    super(data)
    this.rate = data?.rate
    this.value = data?.value
  }
}
export class SaleUnitPrice extends Model {
  untaxedWithDiscount: number
  untaxed: number
  constructor(data: any) {
    super(data)
    this.untaxedWithDiscount = data?.untaxed_with_discount
    this.untaxed = data?.untaxed
  }
}

export class SaleLine extends Model {
  id: number
  name: string
  qty: number
  qtyDelivered: number
  qtyUnavailable: number
  qtyCanceled: number
  product: SaleProduct
  amount: SaleAmount
  discount: SaleDiscount
  unitPrice: SaleUnitPrice
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.qty = data?.qty
    this.qtyDelivered = data?.qty_delivered
    this.qtyUnavailable = data?.qty_unavailable
    this.qtyCanceled = data?.qty_canceled
    this.product = new SaleProduct(data?.product || null)
    this.amount = new SaleAmount(data.amount || {})
    this.unitPrice = new SaleUnitPrice(data.unit_price || {})
    this.discount = data.discount ? new SaleDiscount(data.discount) : null
  }
}

export class SaleInvoice extends Model {
  id: number
  name: string
  date: Date | null
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.date = data && data.date ? new Date(data.date) : null
  }
}

export class SalePaiementMode extends Model {
  id: number
  name: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
  }
}

export class SalePaiement extends Model {
  mode: SalePaiementMode | null
  constructor(data: any) {
    super(data)
    this.mode = data.mode ? new SalePaiementMode(data.mode) : null
  }
}

export class Sale extends Model {
  id: number | null = null
  name: string
  date: Date | null
  state: string
  stateLabel: string
  stateProgress: number
  note: boolean
  invoicing: SaleInvoicing
  invoices: SaleInvoice[]
  lines: SaleLine[] | []
  amount: SaleAmount | null
  delivery: SaleDelivery | null
  customerRef: string
  suiteName: string
  payment: SalePaiement | null

  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.stateProgress = data?.state_progress || 10
    this.date = data && data.date_order ? new Date(data.date_order) : null
    this.state = data?.state
    this.stateLabel = data?.state_label
    this.note = data?.note
    this.invoicing = data?.invoicing ? new SaleInvoicing(data.invoicing) : []
    this.invoices = []
    if (data && data.invoices) {
      data.invoices.forEach((invoice: any) =>
        this.invoices.push(new SaleInvoice(invoice))
      )
    }
    this.lines = Array.isArray(data?.lines) ? data.lines.map((l:any) => new SaleLine(l)) : []
    this.amount = data.amount ? new SaleAmount(data.amount) : null
    this.delivery = data.delivery ? new SaleDelivery(data.delivery) : null
    this.customerRef = data?.customer_ref
    this.suiteName = data?.suite_name
    this.payment = data.payment ? new SalePaiement(data.payment) : null
  }
}
