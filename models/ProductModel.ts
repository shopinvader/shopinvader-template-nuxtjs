import { Model } from '#models'

export class ProductModel extends Model {
  name: string | null = null
  constructor(data: any) {
    super(data)
    this.name = data?.name || null
  }
}
