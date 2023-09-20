export class User {
  login: string | null = null
  constructor(data: any) {
    this.login = data?.login || null
  }
}
