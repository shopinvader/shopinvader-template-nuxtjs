import { Country, Model, State, Title } from '#models'

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
  main: boolean | null
  isDropoffSite: boolean
  constructor(data: any) {
    super(data)
    this.id = data?.id || null
    this.title = data?.title ? new Title(data.title) : null
    this.addressType = data?.address_type || null
    this.city = data?.city || null
    this.country = data?.country ? new Country(data.country) : new Country({ id: data.country_id })
    this.displayName = data?.display_name || null
    this.isCompany = data?.is_company || null
    this.mobile = data?.mobile || null
    this.name = data?.name || null
    this.optIn = data?.opt_in || false
    this.optOut = data?.opt_out || true
    this.phone = data?.phone || null
    this.ref = data?.ref || null
    this.state = data?.state ? new State(data.state) : null
    this.street = data?.street || null
    this.street2 = data?.street2 || null
    this.type = data?.type || 'delivery'
    this.vat = data?.vat || null
    this.zip = data?.zip || null
    this.email = data?.email || null
    this.lang = data?.lang || null
    this.main = data?.main || null
    this.isDropoffSite = data?.is_dropoff_site || false
    this.access = data?.access || {
      delete: !this.main,
      update: true
    }
  }
  toString(): string {
    return `${this.name}, ${this.street} ${this.street2 || ''} - ${this.zip} ${this.city} ${
      this.country?.name || ''
    }`
  }
  isValidAddress(): boolean {
    if (this.isDropoffSite) {
      return true
    }
    const requiredFields = [this.name, this.street, this.zip, this.city]
    return requiredFields.every((field) => {
      return field && field.trim().length > 0
    })
  }
  getJSONData(): any {
    let data: any = {
      name: this.name,
      street: this.street,
      street2: this.street2,
      zip: this.zip || '',
      city: this.city || '',
      phone: this.phone || '',
      mobile: this.mobile || '',
      email: this.email,
      vat: this.vat || '',
      state_id: null
    }
    if (this.country?.id) {
      data = {
        ...data,
        country_id: this.country?.id
      }
    }
    if (this.state?.id) {
      data = {
        ...data,
        state_id: this.state?.id
      }
    }
    if (this.title?.id) {
      data = {
        ...data,
        title_id: this.title?.id
      }
    }
    return data
  }
}
