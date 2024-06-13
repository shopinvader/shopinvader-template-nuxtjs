import type { ShopinvaderProvidersList } from '../types/ShopinvaderConfig'

/**
 * Give access to the shopinvader providers
 * useShopinvaderService
 * @param serviceName string
 */
export const useShopinvaderProviders = <K extends keyof ShopinvaderProvidersList>(
  serviceName: K
): ShopinvaderProvidersList[K] => {
  const shopinvader: any = useNuxtApp().$shopinvader
  if (!shopinvader) {
    return {} as ShopinvaderProvidersList[K]
  }
  const services = shopinvader.providers
  return services?.[serviceName]
}
