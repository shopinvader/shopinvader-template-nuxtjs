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
  public type: string = 'oidc'
  config: AuthOIDCConfig
  client: UserManager
  redirectUri: string
  constructor(provider: ErpFetch, config: AuthOIDCConfig) {
    super(provider)
    this.config = config

  }
  async init() {
    if (!import.meta.env.SSR) {
      const { origin } = useRequestURL()
      this.redirectUri =  new URL(this.config.redirectUri, origin).href
      this.client = new UserManager({
        authority: this.config.authority,
        client_id: this.config.clientId,
        redirect_uri: this.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope,
        post_logout_redirect_uri: new URL(this.config.postLogoutRedirectUri, origin)
          .href,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        automaticSilentRenew: true,
      })
      this.userLoaded = this.userLoaded.bind(this)
      this.userUnloaded = this.userUnloaded.bind(this)

      this.client.events.addUserLoaded(this.userLoaded)
      this.client.events.addUserUnloaded(this.userUnloaded)
      const query = window.location.search
      const oidcUser = await this.client.getUser()
      if(oidcUser) {
        await this.userLoaded()
      } else if (query.includes('code=') && query.includes('state=')) {
         try {
          // Process the redirect callback from the identity provider
          const data = await this.client.signinCallback()
        } finally {
          // Use replaceState to redirect the user away and remove the querystring parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }
  async userLoaded() {
    try {
      const {access_token = ''} = await this.client.getUser()
      const headers = {
        Authorization: `Bearer ${access_token}`
      }
      await this.provider?.post("signin", [], { headers }, '')
      const user = await this.fetchUser()
    } catch (e) {
      console.error(e)
      await this.client.clearStaleState()
    }

  }
  async userUnloaded() {
    await this.provider?.post("signout", [], {}, '')
  }
  async loginRedirect(url?:string): Promise<any> {
    console.log(this.getSession())
    const user = this.getSession() ? await this.fetchUser() : false
    if(!user) {
      if (this.client) {
        await this.client.signinRedirect({ state: 'abcdef', redirect_uri: url })
      }
    } else {
      navigateTo(this.config.redirectUri)
    }
  }
  async logoutRedirect(): Promise<any> {
    if (this.client) {
      await this.client.signoutRedirect()
    }
  }
}
