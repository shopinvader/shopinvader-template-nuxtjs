import { Model, PaymentIcon } from '#models'

export class PaymentMethod extends Model {
  id: number
  name: string
  code: string
  state: string
  inlineFormViewRendered: string
  expressCheckoutFormViewRendered: string
  payableReference: string | null
  icons: PaymentIcon[] = []
  constructor(data: any) {
    super(data)
    this.id = data?.id || 0
    this.name = data?.name || ''
    this.code = data?.code || ''
    this.state = data?.state || ''
    this.inlineFormViewRendered = data?.inline_form_view_rendered || ''
    this.expressCheckoutFormViewRendered = data?.express_checkout_form_view_rendered || ''
    this.payableReference = data?.payable_reference || null
    if (data?.payment_icons?.length > 0) {
      this.icons = data.payment_icons.map((icon: any) => new PaymentIcon(icon))
    }
  }
}
