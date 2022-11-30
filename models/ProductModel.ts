export class ProductModel {
  name: string | null = null
  constructor(data: any) {
    this.name = data?.name || null
  }
}