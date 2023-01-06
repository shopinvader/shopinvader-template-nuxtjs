import { Sale } from '../models/Sale'
import { SalePartial } from '../models/SalePartial'

// Service to fetch Sales
export class SaleService {
  provider: ElasticFetch = null
  constructor(provider: ElasticFetch) {
    this.provider = provider
  }

  
  // BACKEND CALLS
  // =============
  /** @return models of sales with less data */

  async getAll():  Promise<{count: number, sales: SalePartial[]}> {

    const res = await this.provider?.get("sales", [], null)
    console.log("res", res)
    if (res.data) {
      return { count: res.size, sales: res.data.map((item: any) => new SalePartial(item)) }
    }
    return { count: 0, sales: [] }
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async erpGetSalesPartial (page: number, perPage: number): Promise<{count: number, sales: SalePartial[]}> {
    const params: {[k: string]: any} = { per_page: perPage, page }
    const res = await this.provider?.get('sales', params)
    if (res.data) {
      return { count: res.size, sales: res.data.map((item: any) => new SalePartial(item)) }
    }
    return { count: 0, sales: [] }
  }

  async erpGetSale (id: number): Promise<Sale> {
    const res = await this.provider?.get('sales/' + id)
    if (res) {
      return new Sale(res)
    }
    return null
  }

  erpDownloadSale (id: number): Promise<Blob> {
    return this.provider?.get('sales/' + id + '/download', {}, {}, 'blob')
  }
}
