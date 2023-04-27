import { ErpFetch } from '@shopinvader/fetch'
import { defineStore } from 'pinia'
import { User } from '../models'

export class AuthService {
  provider: ErpFetch | null = null
  store: any
  callbackUserLoaded: any
  constructor(provider: ErpFetch) {
    this.provider = provider
    this.store = defineStore('shopinvader', {
      state: () => ({
        user: null as User | null
      }),

      actions: {
        async setUser(data: any | null) {
          if (data) {
            this.user = new User(data)
          } else {
            this.user = null
          }
        }
      }
    })
  }

  async login(login: string, password: string): Promise<boolean> {
    const user: User | null = await this.me()
    if (user) {
      return true
    } else {
      let result = { success: false }
      if (login && password) {
        result = await this.provider?.post('auth/login', {
          login,
          password
        })
      }
      await this.me()
      return result?.success || false
    }
  }

  async me() {
    const data = await this.provider?.get('auth/me', [], null)

    this.setUser(data)
    return this.store().user
  }
  async getUser() {
    return this.store().user
  }
  setUser(data: any) {
    this.store().setUser(data)
    const user: User | null = this.store().user || null
    if (user !== null && typeof this.callbackUserLoaded == 'function') {
      this.callbackUserLoaded(user)
    }
  }
  onUserLoaded(callback: any) {
    this.callbackUserLoaded = callback
  }
}
