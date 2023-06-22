import { Model } from './Model'

export class Currency extends Model {
  id: number
  name: string
  code: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
    this.code = data?.code
  }
}
