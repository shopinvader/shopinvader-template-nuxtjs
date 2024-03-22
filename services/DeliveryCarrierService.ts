import { ErpFetch } from '@shopinvader/fetch'
import { DeliveryCarrier } from '#models'
import { Service } from '#services'

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
  async getAll(uuid?:string | null): Promise<DeliveryCarrier[]> {
    let url = 'delivery_carriers'
    if(uuid) {
      url = `${uuid}/delivery_carriers`
    }
    const data = await this.provider?.get(url, [], null)
    if (Array.isArray(data)) {
      return data.map((item: any) => new DeliveryCarrier(item))
    }
    return []
  }
}
