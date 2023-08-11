import { ErpFetch } from '@shopinvader/fetch'
import { ShopinvaderErpConfig, ShopinvaderProvidersList } from '../../types/ShopinvaderConfig'

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
  const erpUrl = options?.url || null
  const erpKey = options?.key || null

  if (erpUrl === null) {
    throw new Error('API URL not found')
  }
  if (erpKey === null) {
    throw new Error('WEBSITE KEY not found')
  }
  return {
    erp: new ErpFetch(erpUrl, erpKey, fetchAPI)
  }
}
