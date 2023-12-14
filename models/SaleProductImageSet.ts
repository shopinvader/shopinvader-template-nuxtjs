import { Model, SaleProductImage } from '#models'
export class SaleProductImageSet extends Model {
  small: SaleProductImage | null
  medium: SaleProductImage | null
  large: SaleProductImage | null
  constructor(data: any) {
    super(data)
    this.small = data.small ? new SaleProductImage(data.small) : null
    this.medium = data.small ? new SaleProductImage(data.medium) : null
    this.large = data.small ? new SaleProductImage(data.large) : null
  }
}
