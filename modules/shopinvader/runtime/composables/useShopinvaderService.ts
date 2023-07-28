/**
 * useShopinvaderService
 * @param serviceName string
 */
export const useShopinvaderService =  <K extends keyof ShopinvaderServiceList>(
  serviceName: K
): ShopinvaderServiceList[K] => {
  if (!useNuxtApp()?.$shopinvader) {
    return {} as ShopinvaderServiceList[K]
  }
  const services = useNuxtApp().$shopinvader.services
  return services?.[serviceName]
}
