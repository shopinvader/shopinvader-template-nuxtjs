import { Model } from "#models"

export class DeliveryPickupPoint extends Model {
  id: number
  code: string
  name: string
  street: string
  street2: string
  zip: string
  city: string
  phone: string
  stateCode: string
  countryCode: string
  constructor(data: any) {
    super(data)
    this.id = data?.id || null
    this.name = data?.name || null
    this.code = data?.code || null
    this.street = data?.street || null
    this.street2 = data?.street2 || null
    this.zip = data?.zip || null
    this.city = data?.city || null
    this.phone = data?.phone || null
    this.stateCode = data?.state_code || null
    this.countryCode = data?.country_code || null
  }
}
