
export class User  {
  name: string | null = null
  login: string | null = null
  role: string | null = null
  constructor(data: any) {
    this.name = data?.name || null
    this.login = data?.login || data?.email || null
    this.role = data?.role || 'default'
  }
  getJSONData() {
    return {
      name: this.name,
      role: this.role
    }
  }
}
