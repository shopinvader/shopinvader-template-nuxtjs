import { ErpFetch } from '@shopinvader/fetch'
import { type AddressResult, Address } from '#models'

export class AddressService {
  services: ShopinvaderServiceList| null = null
  provider: ErpFetch | null = null
  addresses: Address[] | null = null
  constructor(provider: ErpFetch) {
    this.provider = provider
  }
  init(services: ShopinvaderServiceList) {
    this.services = services
  }
  async getAll(): Promise<Address[] | null> {
    if (this.provider == null) {
      return null
    }
    this.addresses = []
    const mainAddress = await this.getMainAddress() || null
    if(mainAddress){
      this.addresses.push(mainAddress)
    }
    const deliveryAddresses = await this.fetchAddresses('delivery') || []
    this.addresses = this.addresses.concat(deliveryAddresses)
    return this.addresses
  }
  async fetchAddresses(type:string): Promise<Address[] | null> {
    const results = await this.provider?.get(`addresses/${type}`, {}, 'json') || []
    return await results.map((item: any) => this.jsonToModel({...item, type}))
  }
  async getMainAddress(): Promise<Address | null> {
    const data = await this.provider?.get(`addresses/invoicing`, {}, 'json')
    if(data?.[0]) {
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
    if(this.addresses == null) {
      this.addresses  = await this.getAll() || []
    }
    await this.provider?.delete(
      `addresses/${address.type}/${address.id}`, {}, {}, 'text'
    )
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
    if(this.addresses == null) {
      this.addresses  = await this.getAll() || []
    }
    const data = address.getJSONData()
    const result:Address = await this.provider?.post(`addresses/${address.type}/${address.id}`, data)
    const index = this.addresses.findIndex((item: Address) => item.id === address.id)
    this.addresses[index] = this.jsonToModel({
      ...result,
      type: address.type
    })
    return this.addresses[index]
  }

  async create(address: Address): Promise<Address> {
    if(this.addresses == null) {
      this.addresses  = await this.getAll() || []
    }
    const data = address.getJSONData()
    const result = await this.provider?.post(`addresses/${address.type}`, data)

    this.addresses.push(this.jsonToModel({
      ...result,
      type: address.type
    }))
    return result
  }
  normalizeString(str: string): string {
    return str?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }
  async search(queryString: string, type?: string): Promise<Address[]> {
    if(!this.addresses) {
      this.addresses = await this.getAll() || []
    }

    if(!queryString){
      return this.addresses || [] as Address[]
    }

    const normalizedQuery = this.normalizeString(queryString)
    return this.addresses.filter((item: Address) => {
      if(type && item.type !== type){
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
    }) || [] as Address[]
  }
  jsonToModel(json: any): Address {
    const address =  new Address(json)
    if(this.services?.settings) {
      address.country = this.services.settings.options?.countries.find((item: any) => item.id === json.country_id)
    }
    return address
  }
}
