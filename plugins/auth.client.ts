import { User, UserManager } from 'oidc-client-ts';
import { defineStore } from 'pinia'

export class AuthService {

  userManager: UserManager;
  store: any = null;
  constructor() {
    const localePath = useLocalePath()
    const redirectURI = window.location.origin + localePath({ path: 'account/signin-callback' })
    console.log('$i18n', redirectURI)
    const settings = {
      authority: "https://keycloak.demo14.shopinvader.com/auth/realms/master/",
      client_id: "demo14.shopinvader.com",
      redirect_uri: redirectURI,
      silent_redirect_uri: redirectURI,
      response_type: "code",
      scope: "openid email",
      automaticSilentRenew: true,
    }

    this.userManager = new UserManager(settings)
    this.store = defineStore('auth', {
      state: () => (
        {
          user: null as User | null,
        }
      ),
      actions: {
        setUser(user: User | null) {
          this.user = user
        }
      }
    })
    this.userManager.events.addUserLoaded((user) => {
      this.setUser(user)
    })

  }

  public getUser(): Promise<User | null> {
    return this.store().user;
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public async renewToken(): Promise<User | null> {
    this.setUser(await this.userManager.signinSilent() || null)

    return this.store
  }

  public logout(): Promise<void> {
    this.setUser(null)
    return this.userManager.signoutRedirect();

  }

  public silentRenew(): Promise<void> {
    return this.userManager.signinSilentCallback();
  }

  public async setUser(user: User | null) {
    this.store().setUser(user)
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = new AuthService()
  auth.setUser(await auth.getUser())

  return {
    provide: {
      auth
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $user: UserManager
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $user: UserManager
  }
}
