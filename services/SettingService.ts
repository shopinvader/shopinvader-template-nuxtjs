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
    let data: any = null
    try {
      if (this.provider == null) {
        throw new Error('No provider found for products')
      }
      data = await this.provider?.get('settings', [], null)
    } finally {
      return new Settings(data) 
    }
  }
}
