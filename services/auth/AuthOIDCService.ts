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

  constructor(isoLocale: string, ofetch: $Fetch, baseUrl: string, config: AuthOIDCConfig) {
    super(isoLocale, ofetch, baseUrl)
    this.config = config
  }

  override async init(services: ShopinvaderServiceList) {
    await super.init(services)
    if (!import.meta.env.SSR) {
      // After login, redirect to the OIDC intermediate page that will makes the user wait while
      // we manage the token and redirect to the real target page ("target" param or to / by default).

      // Init the OIDC client
      const settings: UserManagerSettings = {
        authority: this.config.authority,
        client_id: this.config.clientId,
        redirect_uri: this.getLocalizedOIDCRedirectUri(),
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
          // The redirection is done in the oidc-redirect page
        } catch (e) {
          console.error(e)
          try {
            // OIDC params maybe already consumed, try to get the user data from the session
            if (this.getSession()) {
              await this.fetchUser()
            }
          } catch {
            // No user data, logout
            await this.logoutRedirect()
          }
        }
      } else if (this.getSession()) {
        // Not coming from the login page, try to get the value from the current session
        await this.fetchUser()
      }
    }
  }

  /** @return the localized page URI that the OIDC provider will redirect to after login */
  getLocalizedOIDCRedirectUri(): string {
    const localePath = useLocalePath()
    const oidcRedirectPath = localePath(this.config.redirectUri || '/account/oidc-redirect')
    // Complete the redirect path with the origin (add the host and protocol to build the full URL)
    const { origin } = useRequestURL()
    return new URL(oidcRedirectPath, origin).href
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

  /** @url must be the full localized URL of the page to redirect to */
  async loginRedirect(path?: string): Promise<any> {
    if (!this.clientOIDC) {
      throw new Error('OIDC client not initialized')
    }
    // Redirect to the OIDC intermediate page with the real target path as a querystring parameter
    const redirectUrl =
      this.getLocalizedOIDCRedirectUri() + '?target=' + encodeURIComponent(path || localePath('/'))
    return this.clientOIDC.signinRedirect({ redirect_uri: redirectUrl })
  }

  /** @path must be the localized path of the page to redirect to */
  async logoutRedirect(path?: string): Promise<any> {
    if (!this.clientOIDC) {
      throw new Error('Client not initialized')
    }
    // Clear the user local session
    await this.setUser(null)
    // Redirect to the OIDC provider to logout
    const localePath = useLocalePath()
    const redirectPath = path || localePath('/')
    // Convert the path to a full URL
    const { origin } = useRequestURL()
    const redirectUrl = new URL(redirectPath, origin).href
    await this.clientOIDC.signoutRedirect({ post_logout_redirect_uri: redirectUrl })
  }

  async userLoaded() {
    // Warning: this method is not only called when the user logs in
    //          but ALSO when the user session is re-established (automaticSilentRenew).
    if (!this.clientOIDC) {
      throw new Error('Client not initialized')
    }
    try {
      const oidcUser = await this.clientOIDC.getUser()
      // Send the token to the backend to create a cookie session
      const headers = {
        Authorization: `Bearer ${oidcUser?.access_token}`
      }
      await this.ofetch(this.urlEndpointAuth + '/signin', { method: 'POST', headers })
      // Get the user data from the backend
      await this.fetchUser()
    } catch (e) {
      console.log(e)
      await this.logoutRedirect()
    }
  }

  async userUnloaded() {
    // Automatically called by the OIDC provider when we log the user out (signoutRedirect)
    try {
      await this.ofetch(this.urlEndpointAuth + '/signout', { method: 'POST' })
    } catch (e) {
      console.error(e)
    }
  }
}
