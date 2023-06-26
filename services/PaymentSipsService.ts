import { ErpFetch } from '@shopinvader/fetch'
import { PaymentService } from './PaymentService'
import { SipsPayment } from '../models'
export class PaymentSipsService extends PaymentService {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }
  async prepare(id = 0, target = 'current_cart'): Promise<SipsPayment> {
    const { baseUrl } = this.provider || { baseUrl: '' }
    const data = await this.provider?.post('/payment_sips/prepare_payment', {
      payment_mode_id: id,
      normal_return_url: baseUrl + '/invader/payment_sips/normal_return',
      automatic_response_url:
        baseUrl + '/invader/payment_sips/automatic_response',
      target
    })

    return new SipsPayment(data)
  }
}
