import { localePath, navigateTo } from '#imports'
import type { User } from '#models'
import { AuthService, type AuthUserCredential } from '#services'
import type { $Fetch } from 'ofetch'
import type {
  oFetchRequestCtx,
  oFetchResponseErrorCtx
} from '~/modules/shopinvader/runtime/types/ShopinvaderConfig'

export interface AuthAPIConfig {
  loginPage: string
  logoutPage: string
}

/**
 * AuthCredentialService : manage user authentication via login/logout request
 * directly to the ERP API.
 *
 * @description AuthCredentialService is a service to manage the user authentication
 * @extends AuthService
 */
export class AuthCredentialService extends AuthService {
  override type: string = 'credentials'
  override authEndpoint: string = 'auth'
  private config: AuthAPIConfig

  constructor(isoLocale: string, ofetch: $Fetch, baseUrl: string, config: AuthAPIConfig) {
    super(isoLocale, ofetch, baseUrl)
    this.config = config
    this.config = {
      ...config,
      loginPage: localePath(config.loginPage) as string,
      logoutPage: localePath(config.logoutPage) as string
    }
  }

  override async init(services: ShopinvaderServiceList) {
    await super.init(services)
    /* check if the user is already logged in localStorage */
    if (this.getSession()) {
      // fetch the user profile
      this.profile()
    } else {
      // No session in localStorage, logout the user
      this.setUser(null)
    }
    this.logoutRedirect = this.logoutRedirect.bind(this)
    this.store().$onAction(async ({ name, args, store }) => {
      const { user } = store
      if (name == 'setUser' && args[0]?.login !== (user as User)?.login && args[0]?.login == null) {
        await navigateTo(this.config.loginPage)
      }
    })
  }

  getConfig(): any {
    return this.config
  }

  // Interceptors to be added in the app fetcher
  async erpInterceptorOnRequest(ctx: oFetchRequestCtx): Promise<void> {
    if (this.getUser()) {
      // Add credentials to the request because we switched from OIDC token authentification
      // to HTTP Cookie Authentification when signin and HTTP Cookies are not sent by default.
      ctx.options.credentials = 'include'
    }
  }
  async erpInterceptorOnResponseError(ctx: oFetchResponseErrorCtx): Promise<void> {
    if (!import.meta.env.SSR) {
      if (ctx.response?.status === 401) {
        // The user is not authenticated anymore
        this.logoutRedirect()
      }
    }
  }
  async elasticInterceptorOnRequest(): Promise<void> {
    // Nothing to do
  }
  async elasticInterceptorOnResponseError(): Promise<void> {
    // Nothing to do
  }

  /**
   * login page redirection
   * @param target
   * @returns
   */
  async loginRedirect(target: string) {
    return !this.getUser()?.value
      ? navigateTo(this.config.loginPage)
      : navigateTo(target || this.config.logoutPage)
  }

  /**
   * logout page redirection
   * @param target page relative URI
   */
  async logoutRedirect(_page?: string | undefined): Promise<any> {
    await this.logout()
    /** Redirection done via store $subscribe */
  }

  /**
   * login user via credentials API (directly with login and password to the API)
   * @param login
   * @param password
   * @returns User | null return the user if the login is successful or null if the login failed
   */
  async login(login: string, password: string): Promise<User | null> {
    // user connection via raw request to avoid error rejection in case of 403 response code (wrong username or password)
    const response = await this.ofetch.raw(this.urlEndpointAuth + '/login', {
      method: 'POST',
      body: { login, password },
      ignoreResponseError: true
    })
    if (response.ok) {
      // user found, fetch user data
      return await this.profile()
    } else if (response.status !== 403) {
      // 403 (password error) is a valid response, we don't want to throw an error
      throw new Error(await response.json())
    }
    return null
  }

  /**
   * logout user via credentials API
   */
  async logout(): Promise<any> {
    await this.ofetch(this.urlEndpointAuth + '/logout', {
      method: 'POST'
    })
    // remove the user from the store
    await this.setUser(null)
  }

  /**
   * Register user
   * @param name
   * @param password
   * @param login
   * @returns
   */
  override async registerUser(
    firstname: string,
    lastname: string,
    password: string,
    login: string
  ): Promise<AuthUserCredential | null> {
    let request = null
    if (login && password && firstname && lastname) {
      request = await this.ofetch(this.urlEndpointAuth + '/register', {
        method: 'POST',
        body: {
          firstname,
          lastname,
          login,
          password
        }
      })
    }
    return request
  }

  /**
   * Reset request password link
   * @param data
   */
  async resetPassword(login: string): Promise<any> {
    return await this.ofetch(this.urlEndpointAuth + '/request_reset_password', {
      method: 'POST',
      body: { login }
    })
  }

  /**
   * Define a new password
   * @param data
   */
  async setPassword(token: string, password: string): Promise<AuthUserCredential> {
    return await this.ofetch(this.urlEndpointAuth + '/set_password', {
      method: 'POST',
      body: { token, password }
    })
  }

  /**
   * get the logged profile
   * @returns User
   */
  async profile(): Promise<User | null> {
    let profile = null
    try {
      profile = await this.ofetch(this.urlEndpointAuth + '/profile')
      if (profile?.login) {
        this.setUser(profile)
      } else {
        this.setUser(null)
      }
    } catch {
      this.setUser(null)
    }
    return profile
  }
  async validateEmail(token: string): Promise<any> {
    return await this.ofetch(this.urlEndpointAuth + '/validate_email', {
      method: 'POST',
      body: { token }
    })
  }
}
