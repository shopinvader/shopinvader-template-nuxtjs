export class PaymentMode {
  id: number
  name: string
  code: string
  description: string
  constructor(data: any) {
    this.id = data?.id || 0
    this.name = data?.name || ''
    this.code = data?.code || ''
    this.description = data?.description || ''
  }
}
