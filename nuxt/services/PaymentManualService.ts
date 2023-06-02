import { ErpFetch } from '@shopinvader/fetch'
import { PaymentService } from './PaymentService'

export class PaymentManualService extends PaymentService {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }
  async addPayment(id = 0, target = 'current_cart'): Promise<any> {
    return await this.provider?.post('payment_manual/add_payment', {
      payment_mode_id: id,
      target: target
    })
  }
}
