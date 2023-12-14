import { Model } from "./Model"

export class SalePaiementMode extends Model {
  id: number
  name: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
  }
}
