import { Settings } from '#models'
import { BaseServiceErp } from '#services'

export class SettingService extends BaseServiceErp {
  public override endpoint: string = 'settings'
  // Warning: Settings are prefilled by the 'services' plugin at startup.
  // It loads the settings from the app.config.ts before the init of the services.
  // Then the settings are overriden by the fetch of the settings (if any).
  public values: Settings | null = null

  setValues(values: Settings) {
    this.values = values
  }

  override async init(service: ShopinvaderServiceList) {
    //await super.init(service)
    const res = await this.getAll()
    if (res) {
      this.setValues(res)
    }
  }

  async getAll(): Promise<Settings | null> {
    let data = {}
    try {
      data = (await this.ofetch(this.urlEndpoint)) || {}
    } catch (e) {
      console.error('Error while fetching settings', e)
      return null
    }
    return new Settings(data)
  }
}
