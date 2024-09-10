import { Country, Currency, Model, State, Title } from '#models'

export class Settings extends Model {
  countries: Country[] | []
  titles: Title[] | []
  states: State[] | []
  currencies: Currency[] | []
  leadSubjects: Title[] | []
  constructor(data: any) {
    super(data)
    this.countries = data?.countries?.map((country: any) => new Country(country)) || []
    this.titles = data?.titles?.map((title: any) => new Title(title)) || []
    this.states = data?.states?.map((state: any) => new State(state)) || []
    this.currencies = data?.currencies?.map((currency: any) => new Currency(currency)) || []
    this.leadSubjects = data?.lead_subjects?.map((a: any) => new Title(a)) || []
  }
}
