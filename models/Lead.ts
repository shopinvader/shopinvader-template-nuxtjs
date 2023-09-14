import { Model } from './Model'
import { Country } from './Country'


export class Lead extends Model {
  email: string | null
  name: string | null
  phone: string | null
  street: string | null
  street2: string | null
  zip: string | null
  city: string | null
  country: Country | null
  state_id: string | null
  company: string | null
  mobile: string | null
  description: string | null
  team_id: string | null
  contact_name: string | null

  constructor(data: any) {
    super(data)
    this.email = data?.email || null
    this.name = data?.name || null
    this.phone = data?.phone || null
    this.street = data?.street || null
    this.street2 = data?.street2 || null
    this.zip = data?.zip || null
    this.city = data?.city || null
    this.country = data?.country ? new Country(data.country) : null
    this.state_id = data?.state_id || null
    this.company = data?.company || null
    this.mobile = data?.mobile || null
    this.description = data?.description || null
    this.team_id = data?.team_id || null
    this.contact_name = data?.contact_name || null
  }
  getJSONData(): any {
    return {
      email: this.email,
      name: this.name,
      street: this.street || '',
      street2: this.street2 || '',
      zip: this.zip || '',
      city: this.city || '',
      phone: this.phone || '',
      country: {
        id: this.country?.id || ''
      },
      state_id: this.state_id || '',
      company: this.company || '',
      mobile: this.mobile || '', 
      description: this.description || '',
      team_id: this.team_id || '',
      contact_name: this.contact_name || ''
    }
  }
}

export interface LeadsResult {
  size: number
  data: Lead[]
}

