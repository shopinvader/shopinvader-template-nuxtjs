import { Settings } from '#models'
import { BaseServiceErp } from './BaseServiceErp'

export class SettingService extends BaseServiceErp {
  public override endpoint: string = 'settings'
  public values: Settings | null = null

  setSettings(res: any) {
    this.values = new Settings(res)
  }

  async init(service: ShopinvaderServiceList) {
    super.init(service)
    if(this.values === null) {
      const res = await this.getAll()
      this.setSettings(res)
    }
  }

  override async init(service: ShopinvaderServiceList) {
    super.init(service)
    if (this.values === null) {
      const res = await this.getAll()
      this.setSettings(res)
    }
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
