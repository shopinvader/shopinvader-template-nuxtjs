export class CartDiscount {
  value: number
  constructor(data: any) {
    this.value = data?.value || 0
  }
}
