import { DeliveryCarrier, DeliveryPickupPoint } from '#models'
import { Service } from '#services'
import { ErpFetch } from '@shopinvader/fetch'

/**
 * Service for managing delivery carriers.
 */
export class DeliveryCarrierService extends Service {
  name = 'deliveryCarriers'
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  /**
   * Retrieves all delivery carriers.
   * @returns A promise that resolves to an array of DeliveryCarrier objects.
   */
  async getAll(uuid?: string | null): Promise<DeliveryCarrier[]> {
    let url = 'delivery_carriers'
    if (uuid) {
      url = `${uuid}/delivery_carriers`
    }
    const data = await this.provider?.get(url, [], null)
    if (Array.isArray(data)) {
      return data.map((item: any) => new DeliveryCarrier(item))
    }
    return []
  }
  async getDeliveryPickups(carrierId: number, name?: string): Promise<DeliveryPickupPoint[]> {
    let query: any = {
      carrier_id: carrierId
    }
    if (name) {
      query = {
        ...query,
        name
      }
    }
    const data = await this.provider?.get(`delivery_pickups`, query, null)
    if (Array.isArray(data)) {
      return data.map((item: any) => new DeliveryPickupPoint(item))
    }
    return []
  }
}
