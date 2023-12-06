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
  const erpUrl = options?.url || ''
  const erpKey = options?.key || ''

  return {
    erp: new ErpFetch(erpUrl, erpKey, fetchAPI)
  }
}
