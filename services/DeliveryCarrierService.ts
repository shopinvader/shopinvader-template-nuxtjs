import { ErpFetch } from '@shopinvader/fetch'
import { DeliveryCarrier } from '#models'
import { Service } from '#services'

export class DeliveryCarrierService extends Service {
  name = 'deliveryCarriers'
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
