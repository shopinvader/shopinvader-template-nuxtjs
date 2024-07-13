import { Address } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

export class AddressService extends BaseServiceErp {
  public endpoint: string = 'addresses'
  public addresses: Address[] | null = null

  async getAll(): Promise<Address[] | null> {
    this.addresses = []
    const mainAddress = (await this.getMainAddress()) || null
    if (mainAddress) {
      this.addresses.push(mainAddress)
    }
    const deliveryAddresses = (await this.fetchAddresses('delivery')) || []
    this.addresses = this.addresses.concat(deliveryAddresses)
    return this.addresses
  }

  async fetchAddresses(type: string): Promise<Address[] | null> {
    const results = (await this.ofetch(this.urlEndpoint + '/' + type)) || []
    return results.map((item: any) => this.jsonToModel({ ...item, type }))
  }

  async getMainAddress(): Promise<Address | null> {
    const data = await this.ofetch(this.urlEndpoint + '/invoicing')
    if (data?.[0]) {
      const item = {
        ...data[0],
        type: 'invoicing',
        main: true
      }
      return this.jsonToModel(item)
    }
    return null
  }

  /**
   * delete an address
   * @param Address address
   * @returns Address[]
   */
  async delete(address: Address): Promise<Address[] | null> {
    if (this.addresses == null) {
      this.addresses = (await this.getAll()) || []
    }
    await this.ofetch(`${this.urlEndpoint}/${address.type}/${address.id}`, {
      method: 'DELETE'
    })
    this.addresses = this.addresses.filter((item: Address) => item.id !== address.id)
    return this.addresses
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async update(address: Address): Promise<Address> {
    if (this.addresses == null) {
      this.addresses = (await this.getAll()) || []
    }
    const result: Address = await this.ofetch(
      this.urlEndpoint + '/' + address.type + '/' + address.id,
      {
        method: 'POST',
        body: address.getJSONData()
      }
    )
    const index = this.addresses.findIndex((item: Address) => item.id === address.id)
    this.addresses[index] = this.jsonToModel({
      ...result,
      type: address.type
    })
    return this.addresses[index]
  }

  async create(address: Address): Promise<Address> {
    if (this.addresses == null) {
      this.addresses = (await this.getAll()) || []
    }
    const result = await this.ofetch(this.urlEndpoint + '/' + address.type, {
      method: 'POST',
      body: address.getJSONData()
    })
    this.addresses.push(
      this.jsonToModel({
        ...result,
        type: address.type
      })
    )
    return result
  }

  async search(queryString: string, type?: string): Promise<Address[]> {
    if (!this.addresses) {
      this.addresses = (await this.getAll()) || []
    }
    if (!queryString) {
      return this.addresses || ([] as Address[])
    }
    const normalizedQuery = this.normalizeString(queryString)
    return (
      this.addresses.filter((item: Address) => {
        if (type && item.type !== type) {
          return false
        }
        const name = [
          item.name,
          item.street,
          item.street2,
          item.city,
          item.zip,
          item.country?.name
        ].join(' ')
        return this.normalizeString(name).includes(normalizedQuery) || false
      }) || ([] as Address[])
    )
  }

  normalizeString(str: string): string {
    return str
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  jsonToModel(json: any): Address {
    const address = new Address(json)
    if (this.services?.settings) {
      address.country = this.services.settings.options?.countries.find(
        (item: any) => item.id === json.country_id
      )
    }
    return address
  }
}
