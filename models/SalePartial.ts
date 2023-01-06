export class SalePartial {
    id: number = null
    name: string
    date: Date
    state: string
    stateLabel: string
    amountTotal: number
  
    constructor (data: any) {
      this.id = data?.id
      this.name = data?.name
      this.date = data && data.date_order ? new Date(data.date_order) : null
      this.state = data?.state
      this.stateLabel = data?.state_label
      this.amountTotal = data?.amount_total
    }
  }
  