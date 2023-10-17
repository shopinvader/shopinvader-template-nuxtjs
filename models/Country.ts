import { Model } from '#models'

export class Country extends Model {
  id: number
  code: string
  name: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
  }
}
