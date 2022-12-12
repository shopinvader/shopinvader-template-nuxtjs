export class CartLineDiscount {
  value: number
  rate: number
  constructor(data: any) {
    this.rate = data?.rate || 0
    this.value = data?.value || 0
  }
}