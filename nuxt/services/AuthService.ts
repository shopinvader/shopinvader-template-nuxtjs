import { storeToRefs } from 'pinia'
import { ErpFetch } from '@shopinvader/fetch'
import { Service } from './Service'
import { User } from '~/models'

export class AuthService extends Service {
  provider: ErpFetch | null = null
  callbacksUserLoaded: any[] = []
  callbacksUserUnLoaded: any[] = []
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }
  async me(): Promise<Ref<User | null>> {
    const data = await this.provider?.get('auth/me', [], null)

    this.setUser(data)
    return this.getUser()
  }
  logout() {
    //this.provider?.post('auth/logout', {})
    this.setUser(null)
  }
  async login(login: string, password: string): Promise<boolean> {
    const user: Ref<User | null> = await this.me()
    if (user?.value) {
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
  async registerUser(user: User): Promise<boolean> {
    let request = { success: false }
    if (user) {
      //request = await this.provider?.post('auth/me', { user }, null)
    }
    //TODO REMOVE THIS LINE
    request = { success: true }
    return request?.success || false
  }
  /**
   * checkRegisterToken : Check the token for the customer registration
   *
   */
  async checkRegisterToken(token: string): Promise<boolean> {
    let response = { success: false }
    //response = await this.provider?.post('auth/token', {token})
    //TODO REMOVE THIS LINE
    response = { success: true }

    return response?.success
  }
  getUser(): Ref<User | null> {
    const store = this.store()
    const { user } = storeToRefs(store)
    return user || null
  }
  setUser(data: any) {
    const store = this.store()
    const user: User | null = data ? new User(data) : null
    store.setUser(user)
    if (user !== null) {
      for (const callback of this.callbacksUserLoaded) {
        if (typeof callback == 'function') {
          callback(user)
        }
      }
    } else {
      for (const callback of this.callbacksUserUnLoaded) {
        if (typeof callback == 'function') {
          callback(user)
        }
      }
    }
  }
  onUserLoaded(callback: any) {
    if (typeof callback == 'function') {
      this.callbacksUserLoaded.push(callback)
    }
  }
  onUserUnloaded(callback: any) {
    if (typeof callback == 'function') {
      this.callbacksUserUnLoaded.push(callback)
    }
  }
}
