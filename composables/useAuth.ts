import { User } from "oidc-client-ts"
import { AuthService } from "~~/plugins/auth.client"

export const useAuth = (): AuthService => {
  return useNuxtApp()?.$auth || null
}

export const useCurrentUser = (): User => {
  return useNuxtApp()?.$auth?.store()?.user || null
}
