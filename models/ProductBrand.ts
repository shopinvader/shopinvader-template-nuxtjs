import { Model } from './Model'

export interface Brand {
  description: string | null
  id: number | string
  name: string | null
}

export class ProductBrand extends Model {
  brand: Brand = { id: '', name: null, description: null }

  constructor(brand: any) {
    super(brand)
    this.brand = brand || null
  }
}
