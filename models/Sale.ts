import { Model,
  SaleInvoice,
  SaleAmount,
  SaleLine,
  SalePaiement,
  SaleDelivery,
  SaleInvoicing
} from '#models'

export class Sale extends Model {
  id: number | null = null
  name: string
  date: Date | null
  state: string
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
    this.state = data?.state
    switch (this.state) {
      case "cancel":
        this.stateProgress = 0
        break
      case "pending":
        this.stateProgress = 30
        break
      case "processing":
        this.stateProgress = 50
        break
      case "delivery_partial":
        this.stateProgress = 70
        break
      case "delivery_full":
        this.stateProgress = 100
        break
      default:
        this.stateProgress = 0
        break
    }
    this.date = data && data?.date_order ? new Date(data.date_order) : null
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
