export class Country {
  id: number
  code: string
  name: string
  constructor(data: any) {
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
  }
}

export class State {
  id: number
  code: string
  name: string
  constructor(data: any) {
    this.id = data?.id
    this.code = data?.code
    this.name = data?.name
  }
}

export class Address {
  id: number
  addressType: string | null
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

  constructor(data: any) {
    this.id = data?.id
    this.addressType = data?.address_type || null
    this.city = data?.city || null
    this.country = data.country ? new Country(data.country) : null
    this.displayName = data?.display_name || null
    this.isCompany = data?.is_company || null
    this.mobile = data?.mobile || null
    this.name = data?.mobile || null
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
  }
}
