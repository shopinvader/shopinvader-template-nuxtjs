import type { ShopinvaderFetchersList } from '../types/ShopinvaderConfig'

/**
 * Give access to the shopinvader fetchers
 * @param fetcherName string
 */
export const useShopinvaderFetchers = <K extends keyof ShopinvaderFetchersList>(
  fetcherName: K
): ShopinvaderFetchersList[K] => {
  const shopinvader: any = useNuxtApp().$shopinvader
  if (!shopinvader) {
    throw new Error('No shopinvader found')
  }
  const fetchers = shopinvader.fetchers
  // Throw error if the fetcher is not found
  if (!fetchers || !Object.prototype.hasOwnProperty.call(fetchers, fetcherName)) {
    throw new Error(`No fetcher found for ${fetcherName}`)
  }
  return fetchers[fetcherName]
}
