import { Model } from './Model'
import { Country } from './Country'


export class Lead extends Model {
  subject: string | null
  email: string | null
  name: string | null
  phone: string | null
  street: string | null
  street2: string | null
  zip: string | null
  city: string | null
  country: Country | null
  company: string | null
  mobile: string | null
  description: string | null

  constructor(data: any) {
    super(data)
    this.subject = data?.subject || null
    this.email = data?.email || null
    this.name = data?.name || null
    this.phone = data?.phone || null
    this.street = data?.street || null
    this.street2 = data?.street2 || null
    this.zip = data?.zip || null
    this.city = data?.city || null
    this.country = data?.country ? new Country(data.country) : null
    this.company = data?.company || null
    this.mobile = data?.mobile || null
    this.description = data?.description || null
  }
  getJSONData(): any {
    let description = [
      this.name,
      this.company,
      this.street,
      this.street2,
      `${this.zip} - ${this.city}`,
      this.country?.name || '',
      this.phone,
      this.mobile,
      '--',
      this.description

    ].join("\n")
    return {
      subject: this.subject || '',
      email: this.email,
      description
    }
  }
}

export interface LeadsResult {
  size: number
  data: Lead[]
}

