import { Model } from '#models'

export class Title extends Model {
  id: number
  name: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
  }
}
