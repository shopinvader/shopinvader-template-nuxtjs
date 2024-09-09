import type { ShopinvaderErpConfig, ShopinvaderProvidersList } from '../../types/ShopinvaderConfig'
import { ErpFetchObservable } from './ErpFetchObservable'

// Fetch API with credentials
export const fetchAPI = async (url: string, options: any) => {
  const auth = useShopinvaderService('auth')
  if (auth !== null && auth?.getUser !== null) {
    options = {
      credentials: 'include',
      cache: 'default',
      ...options
    }
  }
  return await fetch(url, options)
}

// Initialize all the providers
export const initErpProvider = (options: ShopinvaderErpConfig): ShopinvaderProvidersList => {
  const erpUrl = options?.url || ''
  const erpKey = options?.key || ''
  return {
    erp: new ErpFetchObservable(erpUrl, erpKey, fetchAPI)
  }
}
