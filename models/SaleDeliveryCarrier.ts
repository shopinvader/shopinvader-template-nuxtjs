import { Model } from "./Model"

export class SaleDeliveryCarrier extends Model {
  id: number
  name: string
  description: string
  type: string
  code: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.description = data?.description
    this.type = data?.type
    this.code = data?.code
  }
}
