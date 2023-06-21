import { Model } from './Model'

export class ProductCategory extends Model {
  id: number
  urlKey: number
  name: string
  level: number

  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.urlKey = data?.url_key
    this.name = data?.name
    this.level = data?.level
  }
}
