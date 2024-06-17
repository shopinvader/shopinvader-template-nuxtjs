import type { ShopinvaderProvidersList } from '../types/ShopinvaderConfig'

/**
 * Give access to the shopinvader providers
 * @param providerName string
 */
export const useShopinvaderProviders = <K extends keyof ShopinvaderProvidersList>(
  providerName: K
): ShopinvaderProvidersList[K] => {
  const shopinvader: any = useNuxtApp().$shopinvader
  if (!shopinvader) {
    throw new Error('No shopinvader found')
  }
  const providers = shopinvader.providers
  // Throw error if the service is not found
  if (!providers || !Object.prototype.hasOwnProperty.call(providers, providerName)) {
    throw new Error(`No provider found for ${providerName}`)
  }
  return providers[providerName]
}
