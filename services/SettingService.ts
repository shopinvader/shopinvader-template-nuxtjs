import { Settings } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

export class SettingService extends BaseServiceErp {
  public endpoint: string = 'settings'
  public settings: Settings | null = null

  async init(service: ShopinvaderServiceList) {
    super.init(service)
    const res = await this.getAll()
    this.settings = new Settings(res)
  }

  async getAll(): Promise<Settings | null> {
    let data = {}
    try {
      data = (await this.ofetch(this.urlEndpoint)) || {}
    } catch (e) {
      console.error('Error while fetching settings', e)
    }
    return new Settings(data)
  }
}
