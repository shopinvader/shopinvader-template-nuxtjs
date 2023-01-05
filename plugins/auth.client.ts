import { User, UserManager, UserManagerSettings } from 'oidc-client-ts'
import { defineStore } from 'pinia'

export class AuthService {
  userManager: UserManager
  private store: any = null
  constructor(options: UserManagerSettings) {
    const localePath = useLocalePath()
    if (options?.redirect_uri == null) {
      options.redirect_uri =
        window.location.origin +
        localePath({ path: '/account/signin-callback' })
    }
    this.userManager = new UserManager(options)

    /** Store Login state with Pinia */
    this.store = defineStore('auth', {
      state: () => ({
        user: null as User | null
      }),
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
    return this.store().user
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect()
  }

  public async renewToken(): Promise<User | null> {
    this.setUser((await this.userManager.signinSilent()) || null)

    return this.store
  }

  public logout(): Promise<any> {
    this.setUser(null)
    const callback: string = window?.location?.origin || ''
    return this.userManager.signoutRedirect({
      post_logout_redirect_uri: callback
    })
  }

  public silentRenew(): Promise<void> {
    return this.userManager.signinSilentCallback()
  }

  public async setUser(user: User | null) {
    this.store().setUser(user)
  }
}

export default defineNuxtPlugin(async () => {
  const options: UserManagerSettings = useRuntimeConfig()?.auth || null

  const auth = new AuthService(options)
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
