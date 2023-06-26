import { ErpFetch } from '@shopinvader/fetch'
import { DeliveryCarrier } from '../models/DeliveryCarrier'
import { Service } from './Service'

export class DeliveryCarrierService extends Service {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }
  async getAll(): Promise<{ count: number; carriers: DeliveryCarrier[] }> {
    const res = await this.provider?.get('delivery_carriers', [], null)
    if (res.data) {
      return {
        count: res.size,
        carriers: res.data.map((item: any) => new DeliveryCarrier(item))
      }
    }
    return { count: 0, carriers: [] }
  }
}
