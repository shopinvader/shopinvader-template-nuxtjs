import { Country } from "./Country"
import { Title } from "./Title"
import { State } from "./State"
import { Currency } from "./Currency"
export class Settings{
  countries: Country[] | []
  titles: Title[] | []
  states: State[] | []
  currencies: Currency[] | []
  constructor(data: any) {
    this.countries = data?.countries?.map((country: any) => new Country(country))
    this.titles = data?.titles?.map((title: any) => new Title(title))
    this.states = data?.states?.map((state: any) => new State(state))
    this.currencies = data?.currencies?.map((currency: any) => new Currency(currency))

  }
}
