import { User } from '#models'
import nuxtStorage from 'nuxt-storage'
import type { $Fetch, FetchContext } from 'ofetch'
import { storeToRefs } from 'pinia'
import { ServiceLocalized } from './ServiceLocalized'

export interface AuthUserCredential {
  login: string
  mail_verified: boolean
  name: string
  role: string
  has_agent: boolean
  has_market: boolean
}

export abstract class AuthService extends ServiceLocalized {
  // Api
  public ofetch: $Fetch
  public baseUrl: string
  public authEndpoint: string = 'auth'
  public userEndpoint: string = 'customer'
  public urlEndpointAuth: string = ''
  public urlEndpointUser: string = ''
  // Local data
  private callbacksUserLoaded: any[] = []
  private callbacksUserUnLoaded: any[] = []
  public type: string = ''
  public loaded: boolean = false
  private storage: any = null

  abstract getConfig(): any
  abstract loginRedirect(url?: string): Promise<any>
  abstract logoutRedirect(url?: string): Promise<any>
  // Add those to the fetcher
  abstract interceptorOnRequest({ request, options }: FetchContext): void | Promise<void>
  abstract interceptorOnResponseError({
    request,
    response,
    options
  }: FetchContext): void | Promise<void>

  constructor(isoLocale: string, ofetch: $Fetch, baseUrl: string) {
    super(isoLocale)
    this.ofetch = ofetch
    this.baseUrl = baseUrl
    this.storage = nuxtStorage?.localStorage
  }

  init(services: ShopinvaderServiceList): Promise<any> {
    super.init(services)
    this.urlEndpointAuth = this.buildUrlEndpoint(this.baseUrl, this.authEndpoint)
    this.urlEndpointUser = this.buildUrlEndpoint(this.baseUrl, this.userEndpoint)
    return Promise.resolve()
  }

  buildUrlEndpoint(baseUrl: string, entrypoint: string): string {
    return (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + entrypoint
  }

  getUser(): Ref<User | null> {
    const store = this.store()
    const { user } = storeToRefs(store)
    return user
  }

  async fetchUser(): Promise<any> {
    let user = null
    try {
      const profile = await this.ofetch(this.urlEndpointUser)
      if (profile) {
        user = this.setUser(profile)
      }
    } catch (e) {
      this.setUser(null)
      throw e
    }
    return user
  }

  async saveUser(profile: User): Promise<User | null> {
    let user = null
    try {
      const json = profile.getJSONData()
      user = await this.ofetch(this.urlEndpointUser, { method: 'POST', body: json })
    } catch (e) {
      console.error(e)
      user = null
      throw e
    } finally {
      user = await this.setUser(user)
    }
    return user
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
      request = await this.ofetch(this.urlEndpointAuth + '/register', {
        method: 'POST',
        body: {
          name,
          login,
          password
        }
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
  async checkRegisterToken(_token: string): Promise<boolean> {
    // TODO: implement the checkRegisterToken method
    return false
  }
}
