import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type { ErpFetchObservable } from '~/modules/shopinvader'
import { AuthService } from '../AuthService'

export interface AuthOIDCConfig {
  authority: string
  clientId: string
  redirectUri: string
  responseType: string
  scope: string
  postLogoutRedirectUri: string
}

export class AuthOIDCService extends AuthService {
  public type: string = 'oidc'
  config: AuthOIDCConfig
  client: UserManager | null = null
  redirectUri: string | null = null
  services: ShopinvaderServiceList | null = null

  constructor(provider: ErpFetchObservable, config: AuthOIDCConfig) {
    super(provider)
    this.config = config
    if (!import.meta.env.SSR && provider) {
      provider.onError((res: any) => {
        /** Logout if get 401 API RESPONSE */
        const user = this.getUser()?.value
        if (user && res?.status == 401) {
          this.logoutRedirect()
        }
      })
    }
  }
  async init(services: ShopinvaderServiceList): Promise<any> {
    this.services = services
    if (!import.meta.env.SSR) {
      const { origin } = useRequestURL()
      this.redirectUri = new URL(this.config.redirectUri, origin).href
      this.client = new UserManager({
        authority: this.config.authority,
        client_id: this.config.clientId,
        redirect_uri: this.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope,
        post_logout_redirect_uri: new URL(this.config.postLogoutRedirectUri, origin).href,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        automaticSilentRenew: true
      })
      this.userLoaded = this.userLoaded.bind(this)
      this.userUnloaded = this.userUnloaded.bind(this)

      this.client.events.addUserLoaded(this.userLoaded)
      this.client.events.addUserUnloaded(this.userUnloaded)
      const query = window.location.search
      const loginReturn = query.includes('code=') && query.includes('state=')
      try {
        if (loginReturn) {
          await this.client.signinCallback()
        } else if (this.getSession()) {
          await this.fetchUser()
        }
      } catch (e) {
        await this.userUnloaded()
        console.error(e)
      } finally {
        // Use replaceState to redirect the user away and remove the querystring parameters
        if (loginReturn) {
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname)
          }, 300)
        }
      }
    }
    return Promise.resolve()
  }

  getConfig(): any {
    return this.config
  }

  async loginRedirect(url?: string): Promise<any> {
    const query = window.location.search
    const { host, protocol } = useRequestURL()
    const redirectURI = new URL(url || '', `${protocol}//${host}`).href
    let user = false
    try {
      user = this.getSession() ? await this.fetchUser() : false
      if (!user) {
        const loginReturn = query.includes('code=') && query.includes('state=')
        if (this.client && !loginReturn) {
          await this.client.signinRedirect({ redirect_uri: redirectURI })
        } else {
          throw new Error('User not loaded')
        }
      }
    } finally {
      if (user) {
        const domaine = `${protocol}//${host}`
        let options = { external: true }
        if (url?.includes(domaine)) {
          options = { external: false }
          url = url.replace(domaine, '')
        }
        await navigateTo(url, options)
      }
    }
  }

  async logoutRedirect(_page?: string): Promise<any> {
    if (!this.client) {
      throw new Error('Client not initialized')
    }
    const user = await this.client.getUser()
    if (this.client && user) {
      await this.setUser(null)
      await this.client.signoutRedirect()
    }
  }

  async userLoaded() {
    if (!this.client) {
      throw new Error('Client not initialized')
    }
    try {
      const oidcUser = await this.client.getUser()
      const headers = {
        Authorization: `Bearer ${oidcUser?.access_token}`
      }
      await this.provider?.post('signin', [], { headers }, '')
      await this.fetchUser()
    } catch (e) {
      console.log(e)
      await this.userUnloaded()
      await this.client.signoutSilentCallback()
      throw showError({ statusCode: 500, fatal: true })
    }
  }
  async userUnloaded() {
    try {
      await this.provider?.post('signout', [], {}, '')
    } catch (e) {
      console.error(e)
    }
  }
}
