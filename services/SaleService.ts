import { Sale } from '#models'
import type { ProductService } from '#services'
import { BaseServiceErp } from './BaseServiceErp'

// Service to fetch Sales
export class SaleService extends BaseServiceErp {
  public override endpoint: string = 'sales'
  public endpointInvoice: string = 'invoice'
  public urlEndpointInvoice: string = ''
  public productService: ProductService | null = null

  override init(services: ShopinvaderServiceList) {
    super.init(services)
    this.productService = services.products
    this.urlEndpointInvoice = this.buildUrlEndpoint(this.erpBaseUrl, this.endpointInvoice)
  }
  // BACKEND CALLS
  // =============
  /** @return models of sales with less data */

  async getAll(page: number = 1, perPage: number = 10): Promise<{ count: number; items: Sale[] }> {
    const res = await this.ofetch(this.urlEndpoint, { query: { page_size: perPage, page } })
    return {
      count: res?.count || 0,
      items: res.items?.map((item: any) => new Sale(item)) || []
    }
  }

  async getById(id: number): Promise<Sale | null> {
    const json = await this.ofetch(`${this.urlEndpoint}/${id}`)
    if (!json) return null
    const model = this.jsonToModel(json)

    return await this.fetchProductToSale(model)
  }

  download(id: number): Promise<Blob> | null {
    return this.ofetch(`${this.urlEndpoint}/${id}/download'`, { responseType: 'blob' }) || null
  }

  downloadInvoice(id: number): Promise<Blob> | null {
    return (
      this.ofetch(`${this.urlEndpointInvoice}/${id}/download'`, { responseType: 'blob' }) || null
    )
  }

  /**
   * fetch product data from catalog for each line of a sale
   * @param sale without product data
   * @returns sale with product data
   */
  async fetchProductToSale(sale: Sale): Promise<Sale> {
    const ids = sale?.lines.map((line: any) => line.productId).filter((id: any) => id)
    const res = (await this.productService?.getByIds(ids)) || { hits: [] }

    if (res?.hits?.length > 0) {
      sale.lines = sale.lines.map((line: any) => {
        const product = res.hits.find((product: any) => product.id === line.productId) || null
        if (product) {
          line.product = product
        }
        return line
      })
    }
    return sale
  }

  jsonToModel(json: any): Sale {
    return new Sale(json)
  }
}
