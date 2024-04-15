import { Model } from '#models'

export class PaymentData extends Model {
  payable: string | null
  payableReference: string | null
  amount: number | null = 0
  currencyCode: string | null
  amountFormatted: string | null
  constructor(data: any) {
    super(data)
    this.payable = data?.payable || null
    this.payableReference = data?.payable_reference || null
    this.amount = data?.amount || 0
    this.currencyCode = data?.currency_code || null
    this.amountFormatted = data?.amount_formatted || null
  }
}
