import { Address } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

export class CustomerService extends BaseServiceErp {
  public endpoint: string = 'customer'

  async get(): Promise<Address | null> {
    const res = await this.ofetch(this.urlEndpoint)
    if (res) {
      return new Address(res.data)
    }
    return null
  }

  async toggleOptOutCustomer(customer: Address, optIn: any): Promise<Address | null> {
    const res = await this.ofetch(this.urlEndpoint + '/' + customer.id + '/update', {
      method: 'POST',
      body: { optIn }
    })
    if (res) {
      return new Address(res.data)
    }
    return null
  }
}
