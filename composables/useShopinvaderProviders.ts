import { ShopinvaderProvidersList } from '~/plugins/shopinvader-services/type'

/**
 * useShopinvaderService
 * @param serviceName string
 */
export default <K extends keyof ShopinvaderProvidersList>(
  serviceName: K
): ShopinvaderProvidersList[K] => {
  if (!useNuxtApp()?.$shopinvader) {
    return {} as ShopinvaderProvidersList[K]
  }
  const services = useNuxtApp().$shopinvader.providers
  return services?.[serviceName]
}
