import { User } from '#models'
import { Service } from '#services'
import { ErpFetch } from '@shopinvader/fetch'
import nuxtStorage from 'nuxt-storage'
import { storeToRefs } from 'pinia'

export interface AuthUserCredential {
  login: string
  mail_verified: boolean
  name: string
  role: string
  has_agent: boolean
  has_market: boolean
}

export abstract class AuthService extends Service {
  provider: ErpFetch | null = null
  callbacksUserLoaded: any[] = []
  callbacksUserUnLoaded: any[] = []
  type: string = ''
  loaded: boolean = false
  storage: any = null

  abstract init(services: ShopinvaderServiceList): Promise<any>
  abstract getConfig(): any
  abstract loginRedirect(url?: string): Promise<any>
  abstract logoutRedirect(url?: string): Promise<any>

  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
    this.storage = nuxtStorage?.localStorage
  }

  getUser(): Ref<User | null> {
    const store = this.store()
    const { user } = storeToRefs(store)
    return user
  }

  async fetchUser(): Promise<any> {
    let user = null
    try {
      const profile = await this.provider?.get('customer', [], null)
      if (profile) {
        user = this.setUser(profile)
      }
    } catch (e) {
      this.setUser(null)
      throw e
    } finally {
      return user
    }
  }

  async saveUser(profile: User): Promise<User | null> {
    let user = null
    try {
      const json = profile.getJSONData()
      user = await this.provider?.post('customer', json)
    } catch (e) {
      console.error(e)
      user = null
      throw e
    } finally {
      user = await this.setUser(user)
      return user
    }
  }

  async setUser(data: AuthUserCredential | null): Promise<User | null> {
    const store = this.store()
    if (data) {
      const user: User | null = data ? new User(data) : null
      store.setUser(user)
      this.setSession(user !== null)
      if (user !== null) {
        for (const callback of this.callbacksUserLoaded) {
          if (typeof callback == 'function') {
            await callback(user)
          }
        }
      } else {

        for (const callback of this.callbacksUserUnLoaded) {
          if (typeof callback == 'function') {
            await callback(user)
          }
        }
      }
      return user || null
    } else {
      store.setUser(null)
      this.setSession(null)
      for (const callback of this.callbacksUserUnLoaded) {
        if (typeof callback == 'function') {
          await callback(null)
        }
      }
      return null
    }
  }

  /**
   * Register a callback function to be called when the user is loaded
   * @param callback function
   */
  onUserLoaded(callback: (user: User) => void) {
    this.callbacksUserLoaded.push(callback)
  }

  /**
   * Register a callback function to be called when the user is unloaded
   * @param callback
   */
  onUserUnLoaded(callback: (user: User) => void) {
    this.callbacksUserUnLoaded.push(callback)
  }

  setSession(value: boolean | null) {
    if (value) {
      this.storage?.setData?.('auth_user', value, 10, 'd')
    } else {
      this.storage?.removeItem?.('auth_user')
    }
  }

  async registerUser(
    name: string,
    password: string,
    login: string
  ): Promise<AuthUserCredential | null> {
    let request = null
    if (login && password && name) {
      request = await this.provider?.post('auth/register', {
        name,
        login,
        password
      })
    }
    return request
  }

  getSession(): boolean {
    return this.storage?.getData('auth_user') || false
  }

  /**
   * checkRegisterToken : Check the token for the customer registration
   */
  async checkRegisterToken(token: string): Promise<boolean> {
    // TODO: implement the checkRegisterToken method
    return false
  }
}
