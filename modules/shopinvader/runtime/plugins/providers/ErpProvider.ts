import type { ShopinvaderErpConfig } from '../../types/ShopinvaderConfig'
import { ErpFetchObservable } from './ErpFetchObservable'

// Fetch API with credentials
export const fetchAPI = async (url: string, options: any) => {
  const auth = useShopinvaderService('auth')
  if (auth !== null && auth?.getUser !== null) {
    options = {
      // Credentials are needed to automatically send browser's cookies within the request
      credentials: 'include',
      cache: 'default',
      ...options
    }
  }
  return await fetch(url, options)
}

// Initialize the ERP provider
export const createErpProvider = (options: ShopinvaderErpConfig): ErpFetchObservable => {
  const erpUrl = options?.url || ''
  const erpKey = options?.key || ''
  return new ErpFetchObservable(erpUrl, erpKey, fetchAPI)
}
