import { Model } from '#models'

export class SipsPayment extends Model {
  seal: string
  interfaceVersion: string
  actionUrl: string
  constructor(data: any) {
    super(data)
    this.data = data?.sips_data || ''
    this.seal = data?.sips_seal || ''
    this.interfaceVersion = data?.sips_interface_version || ''
    this.actionUrl = data?.sips_form_action_url || ''
  }
}
