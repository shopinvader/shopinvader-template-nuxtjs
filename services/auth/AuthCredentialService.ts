import { localePath, navigateTo } from '#imports'
import type { ErpFetch } from '@shopinvader/fetch'
import type { User } from '~/models'
import { AuthService, type AuthUserCredential } from '../AuthService'

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
  public config: AuthAPIConfig
  public type: string = 'credentials'

  constructor(provider: ErpFetch, config: AuthAPIConfig) {
    super(provider)
    this.config = config
    this.config = {
      ...config,
      loginPage: localePath(config.loginPage) as string,
      logoutPage: localePath(config.logoutPage) as string
    }
  }

  init(): Promise<any> {
    if (this.getSession()) {
      this.profile()
    } else {
      this.setUser(null)
    }
    this.logoutRedirect = this.logoutRedirect.bind(this)
    this.userLoaded()
    this.store().$onAction(async ({ name, args, store }) => {
      const { user } = store
      if (name == 'setUser' && args[0]?.login !== (user as User)?.login && args[0]?.login == null) {
        await navigateTo(this.config.loginPage)
      }
    })
    return Promise.resolve()
  }

  getConfig(): any {
    return this.config
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
  async logoutRedirect(page?: string | undefined): Promise<any> {
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
      const data = await this.provider?.post('auth/login', { login, password })
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
    await this.provider?.post("auth/logout", {})
    await this.setUser(null)
  }

  /**
   * Register user
   * @param name
   * @param password
   * @param login
   * @returns
   */
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

  /**
   * Reset request password link
   * @param data
   */
  async resetPassword(login: string): Promise<any> {
    return await this.provider?.post('auth/request_reset_password', { login })
  }

  /**
   * Define a new password
   * @param data
   */
  async setPassword(token: string, password: string): Promise<AuthUserCredential> {
    return await this.provider?.post('auth/set_password', { token, password })
  }

  /**
   * get the logged profile
   * @returns User
   */
  async profile(): Promise<User | null> {
    let profile = null
    try {
      profile = await this.provider?.get('auth/profile', [], null)
      if (profile?.login) {
        this.setUser(profile)
      } else {
        this.setUser(null)
      }
    } catch (error) {
      this.setUser(null)
    }
    return profile
  }

  userLoaded() {
    const $fetch = this.provider?._fetch
    if ($fetch && this.provider && !import.meta.env.SSR) {
      this.provider._fetch = async (url: string, options: any) => {
        const response = await $fetch(url, options)
        if (response?.status === 401) {
          this.logoutRedirect()
        }
        return response
      }
    }
  }
  async validateEmail(token: string): Promise<any> {
    return await this.provider?.post("auth/validate_email", { token })
  }

}
