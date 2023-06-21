import { ErpFetch } from '@shopinvader/fetch'
import { ShopinvaderErpConfig, ShopinvaderProvidersList } from '../type'

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

export const initErpProvider = (
  options: ShopinvaderErpConfig
): ShopinvaderProvidersList => {
  const erpUrl = options?.api_url || null
  const erpKey = options?.website_key || null
  if (erpUrl === null || erpKey === null) {
    throw new Error('No erp config found')
  }
  return {
    erp: new ErpFetch(erpUrl, erpKey, fetchAPI)
  }
}
