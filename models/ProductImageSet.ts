import { Model, ProductImage } from '#models'

export class ProductImageSet extends Model {
  small: ProductImage | null
  medium: ProductImage | null
  large: ProductImage | null
  xlarge: ProductImage | null
  constructor(data: any) {
    super(data)
    this.small = data && data.small ? new ProductImage(data.small) : null
    this.medium = data && data.medium ? new ProductImage(data.medium) : null
    this.large = data && data.large ? new ProductImage(data.large) : null
    this.xlarge = data && data.xlarge ? new ProductImage(data.xlarge) : null
  }
}
