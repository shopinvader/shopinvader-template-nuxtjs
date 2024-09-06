import { User } from '#models'
import mitt from 'mitt'
import nuxtStorage from 'nuxt-storage'
import type { $Fetch, FetchContext } from 'ofetch'
import { storeToRefs } from 'pinia'
import { BaseServiceLocalized } from './BaseServiceLocalized'

export interface AuthUserCredential {
  login: string
  mail_verified: boolean
  name: string
  role: string
  has_agent: boolean
  has_market: boolean
}

type AuthEvents = {
  'user:loaded': User
  'user:unloaded': User | null
}

export abstract class AuthService extends BaseServiceLocalized {
  // Api
  public ofetch: $Fetch
  public baseUrl: string
  public authEndpoint: string = ''
  public userEndpoint: string = 'customer'
  public urlEndpointAuth: string = ''
  public urlEndpointUser: string = ''
  // Bus
  public readonly bus = mitt<AuthEvents>()
  // Local data
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

  override init(services: ShopinvaderServiceList): Promise<any> {
    super.init(services)
    this.urlEndpointAuth = this.buildUrlEndpoint(this.baseUrl, this.authEndpoint)
    this.urlEndpointUser = this.buildUrlEndpoint(this.baseUrl, this.userEndpoint)
    return Promise.resolve()
  }

  buildUrlEndpoint(baseUrl: string, entrypoint: string): string {
    const url = (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + entrypoint
    return url.endsWith('/') ? url.slice(0, -1) : url
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

  async saveUser(profile: User, logoutOnError = true): Promise<User | null> {
    let user = null
    try {
      const json = profile.getJSONData()
      user = await this.ofetch(this.urlEndpointUser, { method: 'POST', body: json })
    } catch (e) {
      console.error(e)
      if (logoutOnError) {
        this.setUser(null)
      }
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
        this.bus.emit('user:loaded', user)
      } else {
        this.bus.emit('user:unloaded', user)
      }
      return user || null
    } else {
      store.setUser(null)
      this.setSession(null)
      this.bus.emit('user:unloaded', null)
      return null
    }
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
