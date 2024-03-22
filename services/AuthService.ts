import { storeToRefs } from 'pinia'
import { ErpFetch } from '@shopinvader/fetch'
import { Service } from '#services'
import { User } from '#models'
import nuxtStorage from 'nuxt-storage'

export abstract class AuthService extends Service {
  provider: ErpFetch | null = null
  callbacksUserLoaded: any[] = []
  callbacksUserUnLoaded: any[] = []
  type: string = ''
  loaded: boolean = false
  storage: any = null
  abstract loginRedirect(page?:string): Promise<any>
  abstract logoutRedirect(page?:string): Promise<any>
  constructor(provider: ErpFetch) {
    super()
    this.provider = provider
    this.storage = nuxtStorage?.localStorage
  }
  abstract init(services:ShopinvaderServiceList): Promise<any>
  getUser(): Ref<User | boolean | null> {
    const store = this.store()
    const { user } = storeToRefs(store)
    return user
  }
  async fetchUser(): Promise<any> {
    let user = null
    try {
      const profile = await this.provider?.get("customer", [], null)
      if(profile) {
        user = this.setUser(profile)
      }
    } catch (e) {
      this.setUser(null)
    } finally {
      return user
    }
  }
  async saveUser(profile:User):Promise<User | null> {
    let user = null
    try {
      const json = profile.getJSONData()
      user = await this.provider?.post("customer", json)
    } catch (e) {
      console.error(e)
      user = null
      throw e
    } finally {
      user = await this.setUser(user)
      return user
    }
  }
  async setUser(data: any): Promise<User | null> {
    const store = this.store()
    if(data) {
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
  setSession(value: boolean) {
    if(value) {
      this.storage?.setData?.('auth_user', value, 10, 'd')
    } else {
      this.storage?.removeItem?.('auth_user')
    }
  }
  async registerUser(
    name: string,
    password: string,
    login: string
  ): Promise<{ success: boolean}> {
    let request = { success: false }
    if (login && password && name) {
      request = await this.provider?.post('auth/register', {
        name,
        login,
        password
      })
    }
    return request || { success: false }
  }
  getSession(): boolean {
    return this.storage?.getData('auth_user') || false
  }
  abstract getConfig():void
}
