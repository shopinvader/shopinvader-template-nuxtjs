import { ShopinvaderProvidersList } from '../types/ShopinvaderConfig'

/**
 * useShopinvaderService
 * @param serviceName string
 */
export const useShopinvaderProviders = <K extends keyof ShopinvaderProvidersList>(
  serviceName: K
): ShopinvaderProvidersList[K] => {
  if (!useNuxtApp()?.$shopinvader) {
    return {} as ShopinvaderProvidersList[K]
  }
  const services = useNuxtApp().$shopinvader.providers
  return services?.[serviceName]
}
