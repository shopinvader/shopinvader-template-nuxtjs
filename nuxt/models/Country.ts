export class Country {
  id: number
  code: string
  name: string
  constructor(data: any) {
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
  }
}
