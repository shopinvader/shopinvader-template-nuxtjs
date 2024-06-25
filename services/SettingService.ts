import { Settings } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

export class SettingService extends BaseServiceErp {
  public endpoint: string = 'settings'
  public options: any = null

  async init(service: ShopinvaderServiceList) {
    super.init(service)
    this.options = await this.getAll()
  }

  async getAll(): Promise<Settings | null> {
    let data = {}
    try {
      data = (await this.ofetch(this.urlEndpoint + '/all')) || {}
    } catch (e) {
      console.error('Error while fetching settings', e)
    }
    return new Settings(data)
  }

  get(key: string): any {
    return this.options?.[key] || null
  }
}
