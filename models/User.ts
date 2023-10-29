export class User {
  login: string | null = null
  role: string | null = null
  constructor(data: any) {
    this.login = data?.login || null
    this.role = data?.role || 'default'
  }
}
