import { Settings } from '#models'
import { Service } from '#services'
import type { ErpFetch } from '@shopinvader/fetch'

export class SettingService extends Service {
  name = 'settings'
  provider: ErpFetch | null = null
  options: Settings | null = null

  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }

  async init(service: ShopinvaderServiceList) {
    super.init(service)
    this.options = await this.getAll()
  }

  async getAll(): Promise<Settings | null> {
    let data = {}
    if (this.provider == null) {
      throw new Error('No provider found for products')
    }
    try {
      data = (await this.provider?.get('settings/all', [], null)) || {}
    } catch (e) {
      console.error('Error while fetching settings', e)
    }
    return new Settings(data)
  }

  get(key: string): any {
    return this.options?.[key] || null
  }
}
