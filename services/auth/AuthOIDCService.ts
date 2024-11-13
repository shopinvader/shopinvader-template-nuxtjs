import type { $Fetch } from 'ofetch'
import { UserManager, WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts'
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

  override async init(services: ShopinvaderServiceList) {
    await super.init(services)
    if (!import.meta.env.SSR) {
      // After login, redirect to the OIDC intermediate page that will makes the user wait while
      // we manage the token and redirect to the real target page ("target" param or to / by default).

      // First, build the page URI the OIDC provider will redirect to after login
      const localePath = useLocalePath()
      const oidcRedirectPath = localePath(this.config.redirectUri || '/account/oidc-redirect')
      // Complete the redirect path with the origin (add the host and protocol to build the full URL)
      const { origin } = useRequestURL()
      this.redirectUri = new URL(oidcRedirectPath, origin).href

      // Init the OIDC client
      const settings: UserManagerSettings = {
        authority: this.config.authority,
        client_id: this.config.clientId,
        redirect_uri: this.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope,
        post_logout_redirect_uri: new URL(this.config.postLogoutRedirectUri, origin).href,
        automaticSilentRenew: true,
        // We let the OIDC lib manage the storage of the user for us (in local storage)
        userStore: new WebStorageStateStore({ store: window.localStorage })
      }
      this.clientOIDC = new UserManager(settings)

      // Listen to OIDC events
      // Note: the 'addUserLoaded' event is raised when a user session has been established or re-established.
      this.clientOIDC.events.addUserLoaded(this.userLoaded.bind(this))
      this.clientOIDC.events.addUserUnloaded(this.userUnloaded.bind(this))

      // Are we coming back from the OIDC login page?
      const urlQuery = window.location.search
      if (urlQuery.includes('code=') && urlQuery.includes('state=')) {
        // Handle the login return (get the token)
        try {
          await this.clientOIDC.signinCallback()
        } catch (e) {
          console.error(e)
        }
        // Then redirect to the target page, but wait for the Nuxt app to be ready
        // before redirecting else we get into trouble with the Nuxt router and i18n.
        onNuxtReady(async () => {
          // Get the target page from the querystring
          const target = new URLSearchParams(window.location.search).get('target')
          const decodedTarget = target ? decodeURIComponent(target) : '/'
          // Redirect to the target page
          await navigateTo(decodedTarget, { replace: true })
        })
      } else if (this.getSession()) {
        await this.fetchUser()
      }
    }
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
    // Redirect to the OIDC intermediate page with the real target as a querystring parameter
    const urlRedirect = this.redirectUri + '?target=' + encodeURIComponent(url || '/')
    let user = false
    try {
      user = this.getSession() ? await this.fetchUser() : false
      if (!user) {
        const loginReturn = query.includes('code=') && query.includes('state=')
        if (this.clientOIDC && !loginReturn) {
          await this.clientOIDC.signinRedirect({ redirect_uri: urlRedirect })
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
