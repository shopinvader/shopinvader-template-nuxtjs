/**
 * Give access to the shopinvader services
 * @param serviceName string
 */
export const useShopinvaderService = <K extends keyof ShopinvaderServiceList>(
  serviceName: K
): ShopinvaderServiceList[K] => {
  const shopinvader: any = useNuxtApp().$shopinvader
  if (!shopinvader) {
    throw new Error('No shopinvader found')
  }
  const services = shopinvader.services
  if (!services || !Object.prototype.hasOwnProperty.call(services, serviceName)) {
    throw new Error(`No services found for ${serviceName}`)
  }
  return services[serviceName]
}
