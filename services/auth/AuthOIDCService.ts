import type { $Fetch } from 'ofetch'
import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import type {
  oFetchRequestCtx,
  oFetchResponseErrorCtx
} from '~/modules/shopinvader/runtime/types/ShopinvaderConfig'
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
  override type: string = 'oidc'
  config: AuthOIDCConfig
  clientOIDC: UserManager | null = null
  redirectUri: string | null = null

  constructor(isoLocale: string, ofetch: $Fetch, baseUrl: string, config: AuthOIDCConfig) {
    super(isoLocale, ofetch, baseUrl)
    this.config = config
  }

  override async init(services: ShopinvaderServiceList): Promise<any> {
    super.init(services)
    if (!import.meta.env.SSR) {
      const { origin } = useRequestURL()
      this.redirectUri = new URL(this.config.redirectUri, origin).href
      this.clientOIDC = new UserManager({
        authority: this.config.authority,
        client_id: this.config.clientId,
        redirect_uri: this.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope,
        post_logout_redirect_uri: new URL(this.config.postLogoutRedirectUri, origin).href,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        automaticSilentRenew: true
      })
      // Listen to OIDC events
      // Note: the 'addUserLoaded' event is raised when a user session has been established or re-established.
      this.clientOIDC.events.addUserLoaded(this.userLoaded.bind(this))
      this.clientOIDC.events.addUserUnloaded(this.userUnloaded.bind(this))

      const query = window.location.search
      const loginReturn = query.includes('code=') && query.includes('state=')
      try {
        if (loginReturn) {
          await this.clientOIDC.signinCallback()
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
        await this.logoutRedirect()
      }
    }
  }
  async elasticInterceptorOnRequest(): Promise<void> {
    // Nothing to do
  }
  async elasticInterceptorOnResponseError(): Promise<void> {
    // Nothing to do
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
        if (this.clientOIDC && !loginReturn) {
          await this.clientOIDC.signinRedirect({ redirect_uri: redirectURI })
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
    if (!this.clientOIDC) {
      throw new Error('Client not initialized')
    }
    const user = await this.clientOIDC.getUser()
    if (this.clientOIDC && user) {
      await this.setUser(null)
      await this.clientOIDC.signoutRedirect()
    }
  }

  async userLoaded() {
    // Warning: this method is not aonly called when the user logs in
    //          but ALSO when the user session is re-established (automaticSilentRenew).
    if (!this.clientOIDC) {
      throw new Error('Client not initialized')
    }
    try {
      const oidcUser = await this.clientOIDC.getUser()
      const headers = {
        Authorization: `Bearer ${oidcUser?.access_token}`
      }
      await this.ofetch(this.urlEndpointAuth + '/signin', { method: 'POST', headers })
      await this.fetchUser()
    } catch (e) {
      console.log(e)
      await this.userUnloaded()
      await this.clientOIDC.signoutSilentCallback()
      throw showError({ statusCode: 500, fatal: true })
    }
  }

  async userUnloaded() {
    try {
      await this.ofetch(this.urlEndpointAuth + '/signout', { method: 'POST' })
    } catch (e) {
      console.error(e)
    }
  }
}
