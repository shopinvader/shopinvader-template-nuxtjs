import { Model } from '#models'

export class PaymentTransaction extends Model {
  flow: string | null = null
  providerId: number = 0
  providerCode: string | null = null
  reference: string | null = null
  amount: number = 0
  currencyId: number = 0
  partnerId: number = 0
  redirectFormHtml: string | null = null
  sessionId: string | null = null
  publishableKey: string | null = null
  clientSecret: string | null = null
  constructor(data: any) {
    super(data)
    this.flow = data?.flow || null
    this.providerId = data?.provider_id || 0
    this.providerCode = data?.provider_code || null
    this.reference = data?.reference || null
    this.amount = data?.amount || 0
    this.currencyId = data?.currency_id || 0
    this.partnerId = data?.partner_id || 0
    this.redirectFormHtml = data?.redirect_form_html || null
    this.sessionId = data?.session_id || null
    this.publishableKey = data?.publishable_key || null
    this.clientSecret = data?.client_secret || null
  }
}
