import { ErpFetch } from '@shopinvader/fetch'
import { Settings } from '../models/Settings'

export class SettingService {
  provider: ErpFetch | null = null
  options: any = null

  constructor(provider: ErpFetch) {
    this.provider = provider
  }

  async init() {
    this.options = await this.getAll()
  }

  async getAll(): Promise<Settings | null> {
    if (this.provider == null) {
      throw new Error('No provider found for products')
    }
    const data = await this.provider?.get('settings/all', [], null)
    return new Settings(data)
  }
}
