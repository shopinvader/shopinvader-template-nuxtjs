import { ErpFetch } from '@shopinvader/fetch'
import { Sale } from '#models'
import { ProductService } from "#services"
// Service to fetch Sales
export class SaleService {
  name = 'sales'
  provider: ErpFetch | null = null
  productService: ProductService | null = null

  constructor(provider: ErpFetch, productService: ProductService) {
    this.provider = provider
    this.productService = productService
  }

  // BACKEND CALLS
  // =============
  /** @return models of sales with less data */

  async getAll(
    page: number = 1,
    perPage: number = 10
  ): Promise<{ count: number; items: Sale[] }> {
    const params: { [k: string]: any } = { page_size: perPage, page }
    const res = await this.provider?.get('sales', params, null)
    return {
      count: res?.count || 0,
      items: res.items?.map((item: any) => new Sale(item)) || []
    }
  }

  async getById(id: number): Promise<Sale | null> {
    const json = await this.provider?.get('sales/' + id, {}, {})
    if (!json) return null
    const model = this.jsonToModel(json)

    return await this.fetchProductToQuotation(model)
  }

  download(id: number): Promise<Blob | null> {
    return (
      this.provider?.get('sales/' + id + '/download', {}, {}, 'blob') || null
    )
  }

  downloadInvoice(id: number): Promise<Blob | null> {
    return (
      this.provider?.get('invoice/' + id + '/download', {}, {}, 'blob') || null
    )
  }

  async fetchProductToQuotation(sale: Sale): Promise<Sale> {
    const ids = sale?.lines
      .map((line: any) => line.productId)
      .filter((id: any) => id)
    const res = (await this.productService?.getByIds(ids)) || {hits: []}

    if (res?.hits?.length > 0) {
      sale.lines = sale.lines.map((line: any) => {
        const product =
          res.hits.find((product: any) => product.id === line.productId) ||
          null
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
