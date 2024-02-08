import { ErpFetch } from '@shopinvader/fetch'
import { Address } from '#models'
import { Service } from '#services'

export class CustomerService extends Service {
  name = 'customer'
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  async get(): Promise<Address | null> {
    if (this.provider == null) {
      return null
    }
    const res = await this.provider?.get('customer', [], null)
    if (res) {
      return new Address(res.data)
    }
    return null
  }
  async toggleOptOutCustomer(customer: Address, optIn: any): Promise<Address> {
    const res = await this.provider?.post(
      'customer/' + customer.id + '/update',
      {
        optIn
      }
    )
    if (res) {
      return new Address(res.data)
    }
    return null
  }
}
