import { ErpFetch } from '@shopinvader/fetch'
import { Service } from './Service'
import { PaymentMode } from '../models/PaymentModes'

export class PaymentModeService extends Service {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  async getAll(): Promise<{ count: number; modes: PaymentMode[] }> {
    const res = await this.provider?.get('payment_modes', [], null)
    if (res.data) {
      return {
        count: res.size,
        modes: res.data.map((item: any) => new PaymentMode(item))
      }
    }
    return { count: 0, modes: [] }
  }
}
