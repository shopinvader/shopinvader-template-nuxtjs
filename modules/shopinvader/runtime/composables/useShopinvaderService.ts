/**
 * Give access to the shopinvader services
 * useShopinvaderService
 * @param serviceName string
 */
export const useShopinvaderService = <K extends keyof ShopinvaderServiceList>(
  serviceName: K
): ShopinvaderServiceList[K] => {
  const shopinvader: any = useNuxtApp().$shopinvader
  if (!shopinvader) {
    return {} as ShopinvaderServiceList[K]
  }
  const services = shopinvader.services
  return services?.[serviceName]
}
