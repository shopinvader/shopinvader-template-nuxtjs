import { Model } from "#models"

export class SaleProductModel extends Model {
  name: string
  constructor(data: any) {
    super(data)
    this.name = data?.name
  }
}
