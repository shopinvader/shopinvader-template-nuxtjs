import { BaseService } from './BaseService'

export class BaseServiceLocalized extends BaseService {
  currentIsoLocale: string = 'fr_fr'

  constructor(isoLocale: string) {
    super()
    this.currentIsoLocale = isoLocale
  }

  changeLocale(isoLocale: string) {
    this.currentIsoLocale = isoLocale
  }
}
