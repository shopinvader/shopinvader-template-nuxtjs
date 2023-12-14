import { Model, SalePaiementMode } from '#models'

export class SalePaiement extends Model {
  mode: SalePaiementMode | null
  constructor(data: any) {
    super(data)
    this.mode = data.mode ? new SalePaiementMode(data.mode) : null
  }
}
