import { Model } from './Model'
import { Country } from './Country'
import { Title } from './Title'
import { State } from './State'

export interface AddressAccess {
  read: boolean
  update: boolean
  delete: boolean
}

export class Address extends Model {
  id: number
  addressType: string | null
  title: Title | null
  city: string | null
  country: Country | null
  displayName: string | null
  isCompany: boolean | null
  mobile: string | null
  name: string | null
  optIn: boolean | null
  optOut: boolean | null
  phone: string | null
  ref: string | null
  state: State | null
  street: string | null
  street2: string | null
  type: string | null // contact, delivery, other, invoice
  vat: string | null
  zip: string | null
  email: string | null
  lang: string | null
  access: AddressAccess | null

  constructor(data: any) {
    super(data)
    this.id = data?.id || null
    this.title = data.title ? new Title(data.title) : null
    this.addressType = data?.address_type || null
    this.city = data?.city || null
    this.country = data.country ? new Country(data.country) : null
    this.displayName = data?.display_name || null
    this.isCompany = data?.is_company || null
    this.mobile = data?.mobile || null
    this.name = data?.name || null
    this.optIn = data?.opt_in || false
    this.optOut = data?.opt_out || true
    this.phone = data?.phone || null
    this.ref = data?.ref || null
    this.state = data.state ? new State(data.state) : null
    this.street = data?.street || null
    this.street2 = data?.street2 || null
    this.type = data?.type || null
    this.vat = data?.vat || null
    this.zip = data?.zip || null
    this.email = data?.email || null
    this.lang = data?.lang || null
    this.access = data?.access || null
  }
  getJSONData(): any {
    return {
      name: this.name,
      type: this.type,
      street: this.street,
      street2: this.street2,
      zip: this.zip || '',
      city: this.city || '',
      phone: this.phone || '',
      email: this.email,
      title: {
        id: this.title?.id || 0
      },
      country: {
        id: this.country?.id || 0
      }
      /*


      phone: this.phone || '',
      state: {
        id: this.state?.id || 0
      },
      country: {
        id: this.country?.id || 0
      },
      title: {
        id: this.title?.id || 0
      },
      is_company: this.isCompany,
      opt_in: this.optIn,
      opt_out: this.optOut,
      lang: this.lang
      */
    }
  }
}

export interface AddressResult {
  size: number
  data: Address[]
}
