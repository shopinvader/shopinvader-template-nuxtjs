import { Model } from './Model'

export class State extends Model {
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
