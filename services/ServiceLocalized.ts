import { Service } from './Service'

export class ServiceLocalized extends Service {
  currentIsoLocale: string = 'fr_fr'

  constructor(isoLocale: string) {
    super()
    this.currentIsoLocale = isoLocale
  }

  changeLocale(isoLocale: string) {
    this.currentIsoLocale = isoLocale
  }
}
