import { ErpFetch } from '@shopinvader/fetch'
import { Sale } from '#models'

// Service to fetch Sales
export class SaleService {
  name = 'sales'
  provider: ErpFetch | null = null
  constructor(provider: ErpFetch) {
    this.provider = provider
  }

  // BACKEND CALLS
  // =============
  /** @return models of sales with less data */

  async getAll(): Promise<{ count: number; sales: Sale[] }> {
    const res = await this.provider?.get('sales', [], null)
    if (res.data) {
      return {
        count: res.size,
        sales: res.data.map((item: any) => new Sale(item))
      }
    }
    return { count: 0, sales: [] }
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async getSalesList(
    page: number,
    perPage: number
  ): Promise<{ count: number; sales: Sale[] }> {
    const params: { [k: string]: any } = { per_page: perPage, page }
    const res = await this.provider?.get('sales', params, {})
    if (res.data) {
      return {
        count: res.size,
        sales: res.data.map((item: any) => new Sale(item))
      }
    }
    return { count: 0, sales: [] }
  }

  async getSale(id: number): Promise<Sale | null> {
    const res = await this.provider?.get('sales/' + id, {}, {})
    if (res) {
      return new Sale(res)
    }
    return null
  }

  downloadSale(id: number): Promise<Blob | null> {
    return (
      this.provider?.get('sales/' + id + '/download', {}, {}, 'blob') || null
    )
  }

  downloadSaleInvoice(id: number): Promise<Blob | null> {
    return (
      this.provider?.get('invoice/' + id + '/download', {}, {}, 'blob') || null
    )
  }
}
