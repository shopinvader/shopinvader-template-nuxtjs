import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { AuthService } from '../AuthService'
import type { ErpFetchObservable } from '~/modules/shopinvader'


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
  constructor(provider: ErpFetchObservable, config: AuthOIDCConfig) {

    super(provider)
    this.config = config
    if(!import.meta.env.SSR && provider) {
      provider.onError((res:any) => {
        /** Logout if get 401 API RESPONSE */
        const user = this.getUser()?.value
        if(user && res?.status == 401) {
          this.logoutRedirect()
        }
      })
    }

  }
  public async init() {
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

      let oidcUser = null
      let loginReturn = query.includes('code=') && query.includes('state=')

      try {
        if(loginReturn) {
          oidcUser = await this.client.signinCallback()
        } else if(this.getSession()) {
          await this.userLoaded()
        }
      } finally {
        // Use replaceState to redirect the user away and remove the querystring parameters
        if (loginReturn) {
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          }, 300)
        }
      }

    }
  }
  async userLoaded() {
    try {
      let oidcUser = await this.client.getUser()
      const headers = {
        Authorization: `Bearer ${oidcUser?.access_token}`
      }
      await this.provider?.post("signin", [], { headers }, '')
      const user = await this.fetchUser()
    } catch (e) {
      console.error(e)
      await this.client.signoutSilentCallback()
    }

  }
  async userUnloaded() {
    //await this.provider?.post("signout", [], {}, '')
  }
  async loginRedirect(url?:string): Promise<any> {
    const user = this.getSession() ? await this.fetchUser() : false
    if(!user) {
      if (this.client) {
        await this.client.signinRedirect({ redirect_uri: url })
      }
    } else {
      navigateTo(this.config.redirectUri)
    }
  }
  async logoutRedirect(): Promise<any> {
    const user = await this.client.getUser()
    if (this.client && user) {
      await this.setUser(false)
      await this.client.signoutRedirect()
    }
  }

}
