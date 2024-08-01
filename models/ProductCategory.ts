import { Model } from '#models'

export class ProductCategory extends Model {
  id: number
  urlKey: string
  name: string
  level: number
  childs: ProductCategory[] = []
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.urlKey = data?.url_key
    this.name = data?.name
    this.level = data?.level
    this.childs = Array.isArray(data?.childs)
      ? data.childs.map((item: any) => new ProductCategory(item))
      : []
  }
  findCategory(id: number | null): ProductCategory | null {
    if (id) {
      if (this.id === id) {
        return this
      }
      if (this.childs?.length > 0) {
        for (const child of this.childs) {
          const category = child.findCategory(id)
          if (category) {
            return category
          }
        }
      }
    }
    return null
  }
}
