import { ErpFetch } from '@shopinvader/fetch'
import { AddressResult, Address } from './../models/Address'
export class AddressService {
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    this.provider = provider
  }

  async getAll(
    per_page = 2,
    page = 1,
    scope: object | null = null
  ): Promise<AddressResult | null> {
    if (this.provider == null) {
      return null
    }

    if (scope != null) {
      scope = Object.entries(scope).reduce((acc: any, [key, value]) => {
        acc['scope[' + key + ']'] = value
        return acc
      }, {})
    }
    const params = {
      per_page,
      page,
      ...scope
    } as any

    const result = await this.provider?.get('addresses', params, 'json')
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Address(item))
    } as AddressResult
  }

  /**
   * delete an address
   * @param Address address
   * @returns AddressResult
   */
  async delete(address: Address): Promise<AddressResult | null> {
    const data = await this.provider?.post(
      'addresses/' + address.id + '/delete'
    )
    if (data == null) {
      return {
        size: data?.size || 0,
        data: data?.data?.map((item: any) => new Address(item))
      } as AddressResult
    }
    return null
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async update(address: Address): Promise<AddressResult> {
    const data = address.getJSONData()
    const result = await this.provider?.post('addresses/' + address.id, data)
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Address(item))
    } as AddressResult
  }

  async create(address: Address): Promise<AddressResult> {
    const data = address.getJSONData()
    const result = await this.provider?.post('addresses/' + 'create', data)
    return {
      size: result?.size || 0,
      data: result?.data?.map((item: any) => new Address(item))
    } as AddressResult
  }
}
