import { Model } from './Model'

export class User extends Model {
  name: string | null = null
  login: string | null = null
  role: string | null = null
  constructor(data: any) {
    super(data)
    this.name = data?.name || null
    this.login = data?.login || data?.email || null
    this.role = data?.role || data?.pricelist_id || 'default'
  }
  getJSONData(): any {
    return {
      name: this.name,
      role: this.role
    }
  }
}
