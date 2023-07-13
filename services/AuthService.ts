import { storeToRefs } from 'pinia'
import { ErpFetch } from '@shopinvader/fetch'
import { Service } from './Service'
import { User } from '../models'
import nuxtStorage from 'nuxt-storage'
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

export abstract class AuthService extends Service {
  provider: ErpFetch | null = null
  callbacksUserLoaded: any[] = []
  callbacksUserUnLoaded: any[] = []
  abstract signinRedirect(): Promise<any>
  abstract signoutRedirect(): Promise<any>
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
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
    this.setSession(user !== null)
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
  setSession(value: boolean) {
    localStorage.setData('auth_user', value, 10, 'd')
  }
}


export class AuthService2 extends Service {
  provider: ErpFetch | null = null
  callbacksUserLoaded: any[] = []
  callbacksUserUnLoaded: any[] = []

  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
  }
  async me(): Promise<Ref<User | null>> {
    const loggedUser = nuxtStorage.localStorage.getData('auth_user') || null
    if (loggedUser) {
      const data = await this.provider?.get('profile', [], null)
      this.setUser(data)
    }
    return this.getUser()
  }
  logout() {
    this.provider?.post('auth/logout', {})
    this.setUser(null)
  }
  async login(login: string, password: string): Promise<any> {
    const user: Ref<User | null> = this.getUser()

    if (!user?.value) {
      const data = await this.provider?.post('auth/login', {
        login,
        password
      })
      if (data?.login) {
        this.setSession(user !== null)
        await this.me()
      }
    }
  }
  async registerUser(
    name: string,
    password: string,
    login: string
  ): Promise<boolean> {
    let request = { success: false }
    if (login && password && name) {
      request = await this.provider?.post('auth/register', {
        name,
        login,
        password
      })
    }
    return request || false
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
    this.setSession(user !== null)
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
  async resetPassword(login: string): Promise<any> {
    let request = { success: false }
    request = await this.provider?.post('auth/password_reset', { login })
    return request?.success || false
  }
  setSession(value: boolean) {
    nuxtStorage.localStorage.setData('auth_user', value, 10, 'd')
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
