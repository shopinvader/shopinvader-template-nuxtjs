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
 * AuthCredentialService
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
    if (this.getSession()) {
      this.profile()
    } else {
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
   * login user
   * @param login
   * @param password
   */
  async login(login: string, password: string) {
    try {
      const data = await this.ofetch(this.urlEndpointAuth + '/login', {
        method: 'POST',
        body: { login, password }
      })
      if (data?.login) {
        await this.profile()
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * logout user
   */
  async logout(): Promise<any> {
    await this.ofetch(this.urlEndpointAuth + '/logout', {
      method: 'POST'
    })
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
