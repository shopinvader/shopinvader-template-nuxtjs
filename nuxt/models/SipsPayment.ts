export class SipsPayment {
  data: string
  seal: string
  interfaceVersion: string
  actionUrl: string
  constructor(data: any) {
    this.data = data?.sips_data || ''
    this.seal = data?.sips_seal || ''
    this.interfaceVersion = data?.sips_interface_version || ''
    this.actionUrl = data?.sips_form_action_url || ''
  }
}
