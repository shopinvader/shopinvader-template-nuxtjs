import { ErpFetch } from '@shopinvader/fetch'
import { Settings } from '#models'

export class SettingService {
  name = 'settings'
  provider: ErpFetch | null = null
  options: any = null

  constructor(provider: ErpFetch) {
    this.provider = provider
  }

  async init() {
    this.options = await this.getAll()
  }

  async getAll(): Promise<Settings | null> {
    let data = {}
    if (this.provider == null) {
      throw new Error('No provider found for products')
    }
    try {
      data = await this.provider?.get('settings/all', [], null) || {}
    } catch (e) {
      console.error('Error while fetching settings', e)
    } finally {
      return new Settings(data)
    }
  }
}
