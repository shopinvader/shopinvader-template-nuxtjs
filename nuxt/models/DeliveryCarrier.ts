export class DeliveryCarrier {
  id: number
  code: string
  name: string
  description: string
  price: number
  constructor(data: any) {
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
    this.description = data?.description
    this.price = data?.price
  }
}
