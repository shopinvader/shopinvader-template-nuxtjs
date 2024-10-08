import { Model } from '#models'

export class DeliveryCarrier extends Model {
  id: number
  code: string
  name: string
  description: string
  price: number | null = null
  withDropoffSite: boolean = false
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
    this.description = data?.description
    this.price = data?.price_applied_to_cart || null
    this.withDropoffSite = data?.with_dropoff_site || false
  }
}
