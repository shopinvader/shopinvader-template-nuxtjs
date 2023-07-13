import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { ErpFetch } from '@shopinvader/fetch'
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
  config: AuthOIDCConfig
  client: UserManager

  constructor(provider: ErpFetch, config: AuthOIDCConfig) {
    super(provider)
    this.config = config
    if (process.client) {
      const baseUrl = window.location.origin || ''

      this.client = new UserManager({
        authority: config.authority,
        client_id: config.clientId,
        redirect_uri: new URL(config.redirectUri, baseUrl).href,
        response_type: config.responseType,
        scope: config.scope,
        post_logout_redirect_uri: new URL(config.postLogoutRedirectUri, baseUrl)
          .href,
        userStore: new WebStorageStateStore({ store: window.localStorage })
      })
      this.userLoaded = this.userLoaded.bind(this)
      this.refresh = this.refresh.bind(this)
      this.client.events.addAccessTokenExpiring(this.refresh)
      this.client.events.addUserLoaded(this.userLoaded)
      const query = window.location.search
      if (query.includes('code=') && query.includes('state=')) {
        // Process the redirect callback from the identity provider
        this.client.signinCallback()
        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, '/')
      }
    }
  }
  async userLoaded() {
    const $fetch = this.provider?._fetch
    if ($fetch && this.provider) {
      this.provider._fetch = async (url: string, options: any) => {
        const user = await this.client.getUser()
        options = {
          ...options,
          ...(user && { Authorization: `Bearer ${user?.access_token}` })
        }
        return $fetch(url, options)
      }
    }
  }
  async refresh() {
    if (this.client) {
      this.client.startSilentRenew()
    }
  }
  async signinRedirect(): Promise<any> {
    if (this.client) {
      await this.client.signinRedirect()
    }
  }
  async signoutRedirect(): Promise<any> {
    if (this.client) {
      await this.client.signoutRedirect()
    }
  }
  async getUser(): Ref<User | null> {
    if (this.client) {
      return await this.client.getUser()
    }
    return ref(null)
  }
}
