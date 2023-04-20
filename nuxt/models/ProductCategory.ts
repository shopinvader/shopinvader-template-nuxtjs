export class ProductCategory {
  id: number
  urlKey: number
  name: string
  level: number

  constructor(data: any) {
    this.id = data?.id
    this.urlKey = data?.url_key
    this.name = data?.name
    this.level = data?.level
  }
}
