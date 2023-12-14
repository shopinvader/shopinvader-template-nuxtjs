import { Model, SaleProductImageSet, SaleProductModel } from '#models'

export class SaleProduct extends Model {
  id: number
  sku: string
  name: string
  shortName: string
  images: SaleProductImageSet[]
  model: SaleProductModel
  urlKey: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.sku = data?.sku
    this.name = data?.name
    this.shortName = data?.short_name
    this.images = []
    if (data && data.images) {
      data.images.forEach((image: any) =>
        this.images.push(new SaleProductImageSet(image))
      )
    }
    this.model = new SaleProductModel(data?.model || null)
    this.urlKey = data?.url_key
  }
}
