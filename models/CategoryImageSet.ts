import { Model, CategoryImage } from "#models"

export class CategoryImageSet extends Model {
  small: CategoryImage | null
  medium: CategoryImage | null
  large: CategoryImage | null

  constructor(data: any) {
    super(data)
    this.small = data && data.small ? new CategoryImage(data.small) : null
    this.medium = data && data.medium ? new CategoryImage(data.medium) : null
    this.large = data && data.large ? new CategoryImage(data.large) : null
  }
}
