import { DeliveryCarrier } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

/**
 * Service for managing delivery carriers.
 */
export class DeliveryCarrierService extends BaseServiceErp {
  public override endpoint: string = '' // We must cheat here because on service does not start with the entrypoint

  /**
   * Retrieves all delivery carriers.
   * @returns A promise that resolves to an array of DeliveryCarrier objects.
   */
  async getAll(uuid?: string | null): Promise<DeliveryCarrier[]> {
    let url = '/delivery_carriers'
    if (uuid) {
      url = '/' + uuid + '/delivery_carriers'
    }
    const data = await this.ofetch(this.urlEndpoint + url)
    if (Array.isArray(data)) {
      return data.map((item: any) => new DeliveryCarrier(item))
    }
    return []
  }
}
