export class User {
  name: string | null = null
  login: string | null = null
  role: string | null = null
  constructor(data: any) {
    this.name = data?.name || null
    this.login = data?.login || null
    this.role = data?.role || 'default'
  }
}
